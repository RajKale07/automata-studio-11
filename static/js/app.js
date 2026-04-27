let cy;
let animationInterval;
let currentTab = 'dfa';

// Resizable sidebar
const resizer = document.getElementById('resizer');
const sidebar = document.querySelector('.sidebar');

if (resizer && sidebar) {
    let isResizing = false;
    
    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        const newWidth = e.clientX;
        if (newWidth >= 280 && newWidth <= 600) {
            sidebar.style.width = newWidth + 'px';
        }
        e.preventDefault();
    });
    
    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        }
    });
    
    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        }
    });
}

// Resizable diagram/simulator sections
const hResizer = document.getElementById('h-resizer');
const diagramSection = document.querySelector('.diagram-section');
const simulatorSection = document.querySelector('.simulator-section');

if (hResizer && diagramSection && simulatorSection) {
    let isResizingH = false;
    let startY = 0;
    let startDiagramHeight = 0;
    
    hResizer.addEventListener('mousedown', (e) => {
        isResizingH = true;
        startY = e.clientY;
        startDiagramHeight = diagramSection.offsetHeight;
        document.body.style.cursor = 'row-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isResizingH) return;
        
        const deltaY = e.clientY - startY;
        const newHeight = startDiagramHeight + deltaY;
        
        if (newHeight >= 300 && newHeight <= window.innerHeight - 300) {
            diagramSection.style.flex = 'none';
            diagramSection.style.height = newHeight + 'px';
            if (cy) cy.resize();
        }
        e.preventDefault();
    });
    
    document.addEventListener('mouseup', () => {
        if (isResizingH) {
            isResizingH = false;
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        }
    });
    
    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
        if (isResizingH) {
            isResizingH = false;
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeDiagram();
    generateTable();
    switchTab('dfa');
    renderTMList();
});

function loadRegex(val) {
    document.getElementById('regex-input').value = val;
}

// ===== LIBRARY FUNCTIONS =====
const LIBRARY = {
    dfa: {
        ends01: {
            states: ['q0', 'q1', 'q2'],
            alphabet: ['0', '1'],
            start_state: 'q0',
            final_states: ['q2'],
            transitions: { 'q0,0': 'q1', 'q0,1': 'q0', 'q1,0': 'q1', 'q1,1': 'q2', 'q2,0': 'q1', 'q2,1': 'q0' }
        },
        even0s: {
            states: ['even', 'odd'],
            alphabet: ['0', '1'],
            start_state: 'even',
            final_states: ['even'],
            transitions: { 'even,0': 'odd', 'even,1': 'even', 'odd,0': 'even', 'odd,1': 'odd' }
        },
        contains101: {
            states: ['q0', 'q1', 'q2', 'q3'],
            alphabet: ['0', '1'],
            start_state: 'q0',
            final_states: ['q3'],
            transitions: { 'q0,0': 'q0', 'q0,1': 'q1', 'q1,0': 'q2', 'q1,1': 'q1', 'q2,0': 'q0', 'q2,1': 'q3', 'q3,0': 'q3', 'q3,1': 'q3' }
        },
        len3: {
            states: ['q0', 'q1', 'q2'],
            alphabet: ['0', '1'],
            start_state: 'q0',
            final_states: ['q0'],
            transitions: { 'q0,0': 'q1', 'q0,1': 'q1', 'q1,0': 'q2', 'q1,1': 'q2', 'q2,0': 'q0', 'q2,1': 'q0' }
        }
    },
    nfa: {
        ends0110: {
            states: ['q0', 'q1', 'q2', 'q3', 'q4'],
            alphabet: ['0', '1', 'ε'],
            start_state: 'q0',
            final_states: ['q2', 'q4'],
            transitions: { 'q0,ε': ['q1', 'q3'], 'q1,0': ['q2'], 'q2,1': ['q2'], 'q3,1': ['q4'], 'q4,0': ['q4'] }
        },
        third1: {
            states: ['q0', 'q1', 'q2', 'q3'],
            alphabet: ['0', '1'],
            start_state: 'q0',
            final_states: ['q3'],
            transitions: { 'q0,0': ['q0'], 'q0,1': ['q0', 'q1'], 'q1,0': ['q2'], 'q1,1': ['q2'], 'q2,0': ['q3'], 'q2,1': ['q3'] }
        }
    },
    tm: {
        anbn: {
            states: ['q0', 'q1', 'q2', 'q3', 'q4', 'qaccept', 'qreject'],
            input_alphabet: ['a', 'b'],
            tape_alphabet: ['a', 'b', 'X', 'Y', '_'],
            start_state: 'q0',
            accept_state: 'qaccept',
            reject_state: 'qreject',
            transitions: {
                'q0,a': 'q1,X,R',
                'q0,Y': 'q3,Y,R',
                'q0,_': 'qreject,_,R',
                'q1,a': 'q1,a,R',
                'q1,Y': 'q1,Y,R',
                'q1,b': 'q2,Y,L',
                'q1,_': 'qreject,_,R',
                'q2,Y': 'q2,Y,L',
                'q2,a': 'q2,a,L',
                'q2,X': 'q0,X,R',
                'q3,Y': 'q3,Y,R',
                'q3,_': 'qaccept,_,R'
            }
        },
        palindrome: {
            states: ['q0', 'q1', 'q2', 'q3', 'q4', 'qaccept', 'qreject'],
            input_alphabet: ['0', '1'],
            tape_alphabet: ['0', '1', 'X', '_'],
            start_state: 'q0',
            accept_state: 'qaccept',
            reject_state: 'qreject',
            transitions: {
                'q0,0': 'q1,X,R',
                'q0,1': 'q2,X,R',
                'q0,X': 'q0,X,R',
                'q0,_': 'qaccept,_,R',
                'q1,0': 'q1,0,R',
                'q1,1': 'q1,1,R',
                'q1,_': 'q3,_,L',
                'q2,0': 'q2,0,R',
                'q2,1': 'q2,1,R',
                'q2,_': 'q4,_,L',
                'q3,0': 'q0,X,L',
                'q3,X': 'q0,X,L',
                'q4,1': 'q0,X,L',
                'q4,X': 'q0,X,L'
            }
        }
    }
};

function loadDFAExample(key) {
    const ex = LIBRARY.dfa[key];
    if (!ex) return;
    
    document.getElementById('states').value = ex.states.join(',');
    document.getElementById('alphabet').value = ex.alphabet.join(',');
    document.getElementById('start-state').value = ex.start_state;
    document.getElementById('final-states').value = ex.final_states.join(',');
    
    generateTable();
    setTimeout(() => {
        Object.entries(ex.transitions).forEach(([key, val]) => {
            const [state, symbol] = key.split(',');
            const input = document.getElementById(`t-${state}-${symbol}`);
            if (input) input.value = val;
        });
        drawDiagram();
        switchTab('dfa');
        showMessage(`✅ Loaded DFA example: ${key}`, 'accept');
    }, 100);
}

function loadNFAExample(key) {
    const ex = LIBRARY.nfa[key];
    if (!ex) return;
    
    document.getElementById('nfa-states').value = ex.states.join(',');
    document.getElementById('nfa-alphabet').value = ex.alphabet.join(',');
    document.getElementById('nfa-start').value = ex.start_state;
    document.getElementById('nfa-final').value = ex.final_states.join(',');
    
    generateNFATable();
    setTimeout(() => {
        Object.entries(ex.transitions).forEach(([key, val]) => {
            const [state, symbol] = key.split(',');
            const input = document.getElementById(`nfa-t-${state}-${symbol}`);
            if (input) input.value = Array.isArray(val) ? val.join(',') : val;
        });
        drawNFADiagram();
        switchTab('nfa');
        showMessage(`✅ Loaded NFA example: ${key}`, 'accept');
    }, 100);
}

function loadRegexExample(key) {
    const patterns = {
        email: 'a*@a*.a*',
        div2: '(0|1)*0',
        alt01: '(01)*'
    };
    document.getElementById('regex-input').value = patterns[key] || '';
    switchTab('regex');
    showMessage(`✅ Loaded regex example: ${key}`, 'accept');
}

function loadTMExample(key) {
    const ex = LIBRARY.tm[key];
    if (!ex) return;
    
    document.getElementById('tm-states').value = ex.states.join(',');
    document.getElementById('tm-input-alphabet').value = ex.input_alphabet.join(',');
    document.getElementById('tm-alphabet').value = ex.tape_alphabet.join(',');
    document.getElementById('tm-start').value = ex.start_state;
    document.getElementById('tm-accept').value = ex.accept_state;
    document.getElementById('tm-reject').value = ex.reject_state;
    
    tmTransitions = { ...ex.transitions };
    renderTMList();
    drawTMDiagram();
    switchTab('turing');
    showMessage(`✅ Loaded TM example: ${key}`, 'accept');
}

// Switch between tabs
function switchTab(tabName) {
    currentTab = tabName;
    
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }
    
    // Add active class to clicked button
    const buttons = document.querySelectorAll('.tab-btn');
    const tabNames = ['dfa', 'nfa', 'regex', 'turing', 'library', 'editor', 'ai'];
    const index = tabNames.indexOf(tabName);
    if (index !== -1 && buttons[index]) {
        buttons[index].classList.add('active');
    }
    
    // Clear diagram when switching tabs
    if (cy) {
        cy.elements().remove();
    }
    
    // Update diagram title
    const diagramTitle = document.getElementById('diagram-title');
    const simTitle = document.getElementById('sim-title');
    const titles = {
        'dfa': 'DFA Diagram', 'nfa': 'NFA Diagram',
        'regex': 'Regex → DFA Diagram', 'turing': 'Turing Machine Diagram',
        'library': 'Library Examples', 'editor': 'Visual Editor', 'ai': 'AI Assistant'
    };
    if (diagramTitle) diagramTitle.textContent = titles[tabName] || 'Diagram';
    if (simTitle) simTitle.textContent = tabName === 'turing' ? 'Test Your Turing Machine' : 'Test Your Automaton';
    
    // Trigger resize for cytoscape
    if (cy) {
        setTimeout(() => cy.resize(), 100);
    }
}

// Initialize Cytoscape diagram
function initializeDiagram() {
    cy = cytoscape({
        container: document.getElementById('cy'),
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#2C5F8A',
                    'label': 'data(label)',
                    'color': '#ffffff',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'font-size': '16px',
                    'font-weight': '600',
                    'width': '64px',
                    'height': '64px',
                    'border-width': '3px',
                    'border-color': '#1A3F5C'
                }
            },
            {
                selector: 'node.start',
                style: {
                    'border-color': '#2D7A4F',
                    'border-width': '5px'
                }
            },
            {
                selector: 'node.final',
                style: {
                    'border-style': 'double',
                    'border-width': '7px',
                    'border-color': '#C0392B'
                }
            },
            {
                selector: 'node.active',
                style: {
                    'background-color': '#2D7A4F',
                    'border-color': '#2D7A4F'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'line-color': '#3A7AB5',
                    'target-arrow-color': '#3A7AB5',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'label': 'data(label)',
                    'color': '#1A1A2E',
                    'text-background-color': '#FDFBF7',
                    'text-background-opacity': 1,
                    'text-background-padding': '4px',
                    'font-size': '13px',
                    'font-weight': '600',
                    'text-wrap': 'wrap',
                    'text-max-width': '80px',
                    'loop-direction': '0deg',
                    'loop-sweep': '60deg',
                    'control-point-step-size': 40
                }
            },
            {
                selector: 'edge.active',
                style: {
                    'line-color': '#2D7A4F',
                    'target-arrow-color': '#2D7A4F',
                    'width': 5
                }
            }
        ],
        layout: { name: 'circle' }
    });

    // Enable editing only in Visual Editor tab
    cy.on('tap', 'edge', function(evt) {
        if (currentTab === 'editor') {
            const edge = evt.target;
            const newLabel = prompt('Edit transition symbol:', edge.data('label'));
            if (newLabel !== null && newLabel.trim()) {
                edge.data('label', newLabel);
                showEditorStatus('Transition updated! Remember to save.', 'success');
            }
        }
    });

    cy.on('dbltap', 'node', function(evt) {
        if (currentTab === 'editor') {
            const node = evt.target;
            const newLabel = prompt('Edit state name:', node.data('label'));
            if (newLabel !== null && newLabel.trim()) {
                const oldId = node.id();
                node.data('label', newLabel);
                node.data('id', newLabel);
                showEditorStatus('State renamed! Remember to save.', 'success');
            }
        }
    });

    cy.on('cxttap', 'node', function(evt) {
        if (currentTab === 'editor') {
            const node = evt.target;
            if (node.hasClass('final')) {
                node.removeClass('final');
                showEditorStatus('Final state removed! Remember to save.', 'success');
            } else {
                node.addClass('final');
                showEditorStatus('Final state added! Remember to save.', 'success');
            }
        }
    });
}

// Generate transition table
function generateTable() {
    const states = document.getElementById('states').value.split(',').map(s => s.trim()).filter(s => s);
    const alphabet = document.getElementById('alphabet').value.split(',').map(s => s.trim()).filter(s => s);
    
    if (states.length === 0 || alphabet.length === 0) {
        document.getElementById('transition-table').innerHTML = '<p style="color: #e53e3e;">Please enter states and alphabet first</p>';
        return;
    }

    let html = '<table><thead><tr><th>State</th>';
    alphabet.forEach(symbol => {
        html += `<th>On "${symbol}"</th>`;
    });
    html += '</tr></thead><tbody>';

    states.forEach(state => {
        html += `<tr><td><strong>${state}</strong></td>`;
        alphabet.forEach(symbol => {
            html += `<td><input type="text" id="t-${state}-${symbol}" placeholder="→"></td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    document.getElementById('transition-table').innerHTML = html;
}

// Draw diagram from table
function drawDiagram() {
    const states = document.getElementById('states').value.split(',').map(s => s.trim()).filter(s => s);
    const startState = document.getElementById('start-state').value.trim();
    const finalStates = document.getElementById('final-states').value.split(',').map(s => s.trim()).filter(s => s);
    const transitions = getTransitions();

    cy.elements().remove();

    // Add nodes
    states.forEach(state => {
        const classes = [];
        if (state === startState) classes.push('start');
        if (finalStates.includes(state)) classes.push('final');
        
        cy.add({
            group: 'nodes',
            data: { id: state, label: state },
            classes: classes.join(' ')
        });
    });

    // Add edges
    const edgeMap = {};
    Object.keys(transitions).forEach(key => {
        const [state, symbol] = key.split(',');
        const target = transitions[key];
        const edgeKey = `${state}-${target}`;
        
        if (edgeMap[edgeKey]) {
            edgeMap[edgeKey] += `, ${symbol}`;
        } else {
            edgeMap[edgeKey] = symbol;
        }
    });

    Object.keys(edgeMap).forEach(edgeKey => {
        const [source, target] = edgeKey.split('-');
        cy.add({
            group: 'edges',
            data: { id: edgeKey, source, target, label: edgeMap[edgeKey] }
        });
    });

    cy.layout({ name: 'circle', animate: true, animationDuration: 500 }).run();
    showMessage('Diagram drawn! Drag nodes to rearrange.', 'info');
}

// Get transitions from table
function getTransitions() {
    const states = document.getElementById('states').value.split(',').map(s => s.trim()).filter(s => s);
    const alphabet = document.getElementById('alphabet').value.split(',').map(s => s.trim()).filter(s => s);
    const transitions = {};

    states.forEach(state => {
        alphabet.forEach(symbol => {
            const input = document.getElementById(`t-${state}-${symbol}`);
            if (input && input.value.trim()) {
                transitions[`${state},${symbol}`] = input.value.trim();
            }
        });
    });

    return transitions;
}

// Update table from diagram edits
function updateTableFromDiagram() {
    const edges = cy.edges();
    edges.forEach(edge => {
        const source = edge.source().id();
        const target = edge.target().id();
        const labels = edge.data('label').split(',').map(s => s.trim());
        
        labels.forEach(label => {
            const input = document.getElementById(`t-${source}-${label}`);
            if (input) input.value = target;
        });
    });
}

// Simulate DFA
async function simulate() {
    const inputString = document.getElementById('input-string').value;
    if (!inputString) {
        showMessage('Please enter an input string', 'reject');
        return;
    }

    const data = {
        states: document.getElementById('states').value.split(',').map(s => s.trim()).filter(s => s),
        alphabet: document.getElementById('alphabet').value.split(',').map(s => s.trim()).filter(s => s),
        transitions: getTransitions(),
        start_state: document.getElementById('start-state').value.trim(),
        final_states: document.getElementById('final-states').value.split(',').map(s => s.trim()).filter(s => s),
        input_string: inputString
    };

    try {
        const response = await fetch('/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.error) {
            showMessage('Error: ' + result.error, 'reject');
            return;
        }

        animateSimulation(result, inputString);
    } catch (error) {
        showMessage('Connection error: ' + error, 'reject');
    }
}

// Animate simulation
function animateSimulation(result, inputString) {
    let step = 0;
    const path = result.path;
    
    cy.nodes().removeClass('active');
    cy.edges().removeClass('active');
    
    if (animationInterval) clearInterval(animationInterval);
    
    animationInterval = setInterval(() => {
        cy.nodes().removeClass('active');
        cy.edges().removeClass('active');
        
        if (step < path.length) {
            cy.getElementById(path[step]).addClass('active');
            
            if (step > 0) {
                const edgeId = `${path[step-1]}-${path[step]}`;
                cy.getElementById(edgeId).addClass('active');
            }
            
            step++;
        } else {
            clearInterval(animationInterval);
            displayResult(result);
        }
    }, 1000);
}

// Display result
function displayResult(result) {
    const resultDiv = document.getElementById('result');
    
    if (result.accepted) {
        resultDiv.className = 'result-box result-accept';
        resultDiv.innerHTML = `
            <strong>✅ ACCEPTED</strong><br>
            Final State: ${result.final_state}<br>
            Path: ${result.path.join(' → ')}
        `;
    } else {
        resultDiv.className = 'result-box result-reject';
        resultDiv.innerHTML = `
            <strong>❌ REJECTED</strong><br>
            Final State: ${result.final_state}<br>
            Path: ${result.path.join(' → ')}
        `;
    }
}

// Reset simulation
function resetSim() {
    if (animationInterval) clearInterval(animationInterval);
    cy.nodes().removeClass('active');
    cy.edges().removeClass('active');
    document.getElementById('result').innerHTML = '';
    document.getElementById('input-string').value = '';
}

// Show message
function showMessage(msg, type) {
    const resultDiv = document.getElementById('result');
    resultDiv.className = `result-box result-${type}`;
    resultDiv.innerHTML = msg;
}

// Validate DFA
async function validateDFA() {
    const data = {
        states: document.getElementById('states').value.split(',').map(s => s.trim()).filter(s => s),
        alphabet: document.getElementById('alphabet').value.split(',').map(s => s.trim()).filter(s => s),
        transitions: getTransitions(),
        start_state: document.getElementById('start-state').value.trim(),
        final_states: document.getElementById('final-states').value.split(',').map(s => s.trim()).filter(s => s)
    };

    try {
        const response = await fetch('/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        showMessage(result.valid ? '✅ ' + result.message : '❌ ' + result.message, result.valid ? 'accept' : 'reject');
    } catch (error) {
        showMessage('Error: ' + error, 'reject');
    }
}

// Minimize DFA
async function minimizeDFA() {
    const data = {
        states: document.getElementById('states').value.split(',').map(s => s.trim()).filter(s => s),
        alphabet: document.getElementById('alphabet').value.split(',').map(s => s.trim()).filter(s => s),
        transitions: getTransitions(),
        start_state: document.getElementById('start-state').value.trim(),
        final_states: document.getElementById('final-states').value.split(',').map(s => s.trim()).filter(s => s)
    };

    try {
        const response = await fetch('/minimize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.error) {
            showMessage('Error: ' + result.error, 'reject');
            return;
        }

        document.getElementById('states').value = result.states.join(',');
        document.getElementById('start-state').value = result.start_state;
        document.getElementById('final-states').value = result.final_states.join(',');
        
        generateTable();
        
        setTimeout(() => {
            Object.keys(result.transitions).forEach(key => {
                const [state, symbol] = key.split(',');
                const input = document.getElementById(`t-${state}-${symbol}`);
                if (input) input.value = result.transitions[key];
            });
            drawDiagram();
            showMessage(`✅ Minimized to ${result.states.length} states`, 'accept');
        }, 100);
    } catch (error) {
        showMessage('Error: ' + error, 'reject');
    }
}

// Detect unreachable states
async function detectUnreachable() {
    const data = {
        states: document.getElementById('states').value.split(',').map(s => s.trim()).filter(s => s),
        alphabet: document.getElementById('alphabet').value.split(',').map(s => s.trim()).filter(s => s),
        transitions: getTransitions(),
        start_state: document.getElementById('start-state').value.trim(),
        final_states: document.getElementById('final-states').value.split(',').map(s => s.trim()).filter(s => s)
    };

    try {
        const response = await fetch('/unreachable', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.error) {
            showMessage('Error: ' + result.error, 'reject');
            return;
        }

        if (result.unreachable.length === 0) {
            showMessage('✅ No unreachable states found', 'accept');
        } else {
            showMessage(`⚠️ Unreachable states: ${result.unreachable.join(', ')}`, 'info');
        }
    } catch (error) {
        showMessage('Error: ' + error, 'reject');
    }
}

// Layout controls
function resetLayout() {
    cy.layout({ name: 'circle', animate: true, animationDuration: 500 }).run();
}

function zoomIn() {
    cy.zoom(cy.zoom() * 1.2);
}

function zoomOut() {
    cy.zoom(cy.zoom() * 0.8);
}

// Update states after editing node
function updateStatesAfterEdit(oldId, newId) {
    const statesInput = document.getElementById('states');
    if (statesInput) {
        const states = statesInput.value.split(',').map(s => s.trim());
        const index = states.indexOf(oldId);
        if (index !== -1) {
            states[index] = newId;
            statesInput.value = states.join(',');
        }
    }
}

// Update final states from diagram
function updateFinalStatesFromDiagram() {
    const finalStates = [];
    cy.nodes('.final').forEach(node => {
        finalStates.push(node.id());
    });
    const finalInput = document.getElementById('final-states');
    if (finalInput) {
        finalInput.value = finalStates.join(',');
    }
}

// ===== NFA FUNCTIONS =====
function generateNFATable() {
    const states = document.getElementById('nfa-states').value.split(',').map(s => s.trim()).filter(s => s);
    const alphabet = document.getElementById('nfa-alphabet').value.split(',').map(s => s.trim()).filter(s => s);
    
    if (states.length === 0 || alphabet.length === 0) {
        document.getElementById('nfa-transition-table').innerHTML = '<p style="color: #e53e3e;">Please enter states and alphabet first</p>';
        return;
    }

    let html = '<table><thead><tr><th>State</th>';
    alphabet.forEach(symbol => {
        html += `<th>On "${symbol}"</th>`;
    });
    html += '</tr></thead><tbody>';

    states.forEach(state => {
        html += `<tr><td><strong>${state}</strong></td>`;
        alphabet.forEach(symbol => {
            html += `<td><input type="text" id="nfa-t-${state}-${symbol}" placeholder="q1,q2"></td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    document.getElementById('nfa-transition-table').innerHTML = html;
}

function getNFATransitions() {
    const states = document.getElementById('nfa-states').value.split(',').map(s => s.trim()).filter(s => s);
    const alphabet = document.getElementById('nfa-alphabet').value.split(',').map(s => s.trim()).filter(s => s);
    const transitions = {};

    states.forEach(state => {
        alphabet.forEach(symbol => {
            const input = document.getElementById(`nfa-t-${state}-${symbol}`);
            if (input && input.value.trim()) {
                transitions[`${state},${symbol}`] = input.value.split(',').map(s => s.trim()).filter(s => s);
            }
        });
    });

    return transitions;
}

function drawNFADiagram() {
    const states = document.getElementById('nfa-states').value.split(',').map(s => s.trim()).filter(s => s);
    const startState = document.getElementById('nfa-start').value.trim();
    const finalStates = document.getElementById('nfa-final').value.split(',').map(s => s.trim()).filter(s => s);
    const transitions = getNFATransitions();

    cy.elements().remove();

    states.forEach(state => {
        const classes = [];
        if (state === startState) classes.push('start');
        if (finalStates.includes(state)) classes.push('final');
        
        cy.add({
            group: 'nodes',
            data: { id: state, label: state },
            classes: classes.join(' ')
        });
    });

    const edgeMap = {};
    Object.keys(transitions).forEach(key => {
        const [state, symbol] = key.split(',');
        const targets = transitions[key];
        targets.forEach(target => {
            const edgeKey = `${state}-${target}`;
            if (edgeMap[edgeKey]) {
                edgeMap[edgeKey] += `, ${symbol}`;
            } else {
                edgeMap[edgeKey] = symbol;
            }
        });
    });

    Object.keys(edgeMap).forEach(edgeKey => {
        const [source, target] = edgeKey.split('-');
        cy.add({
            group: 'edges',
            data: { id: edgeKey, source, target, label: edgeMap[edgeKey] }
        });
    });

    cy.layout({ name: 'circle', animate: true, animationDuration: 500 }).run();
    showMessage('NFA diagram drawn!', 'info');
}

async function simulateNFA() {
    const inputString = document.getElementById('nfa-input-string').value;
    const data = {
        states: document.getElementById('nfa-states').value.split(',').map(s => s.trim()).filter(s => s),
        alphabet: document.getElementById('nfa-alphabet').value.split(',').map(s => s.trim()).filter(s => s),
        transitions: getNFATransitions(),
        start_state: document.getElementById('nfa-start').value.trim(),
        final_states: document.getElementById('nfa-final').value.split(',').map(s => s.trim()).filter(s => s),
        input_string: inputString
    };

    try {
        const response = await fetch('/nfa/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.error) {
            showMessage('Error: ' + result.error, 'reject');
        } else {
            showMessage(result.accepted ? '✅ ACCEPTED' : '❌ REJECTED', result.accepted ? 'accept' : 'reject');
        }
    } catch (error) {
        showMessage('Error: ' + error, 'reject');
    }
}

async function convertNFAtoDFA() {
    const data = {
        states: document.getElementById('nfa-states').value.split(',').map(s => s.trim()).filter(s => s),
        alphabet: document.getElementById('nfa-alphabet').value.split(',').map(s => s.trim()).filter(s => s),
        transitions: getNFATransitions(),
        start_state: document.getElementById('nfa-start').value.trim(),
        final_states: document.getElementById('nfa-final').value.split(',').map(s => s.trim()).filter(s => s)
    };

    try {
        const response = await fetch('/nfa/to-dfa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.error) {
            showMessage('Error: ' + result.error, 'reject');
            return;
        }

        // Switch to DFA tab and populate
        switchTab('dfa');
        document.querySelector('.tab-btn').click();
        
        document.getElementById('states').value = result.states.join(',');
        document.getElementById('alphabet').value = result.alphabet.join(',');
        document.getElementById('start-state').value = result.start_state;
        document.getElementById('final-states').value = result.final_states.join(',');
        
        generateTable();
        setTimeout(() => {
            Object.keys(result.transitions).forEach(key => {
                const [state, symbol] = key.split(',');
                const input = document.getElementById(`t-${state}-${symbol}`);
                if (input) input.value = result.transitions[key];
            });
            drawDiagram();
            showMessage('✅ Converted NFA to DFA', 'accept');
        }, 100);
    } catch (error) {
        showMessage('Error: ' + error, 'reject');
    }
}

// ===== REGEX FUNCTIONS =====
async function convertRegexToDFA() {
    const regex = document.getElementById('regex-input').value.trim();
    if (!regex) {
        showMessage('Please enter a regular expression', 'reject');
        return;
    }

    try {
        const response = await fetch('/regex/to-dfa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ regex })
        });
        
        const result = await response.json();
        if (result.error) {
            showMessage('Error: ' + result.error, 'reject');
            return;
        }

        // Switch to DFA tab and populate
        switchTab('dfa');
        document.querySelector('.tab-btn').click();
        
        document.getElementById('states').value = result.states.join(',');
        document.getElementById('alphabet').value = result.alphabet.join(',');
        document.getElementById('start-state').value = result.start_state;
        document.getElementById('final-states').value = result.final_states.join(',');
        
        generateTable();
        setTimeout(() => {
            Object.keys(result.transitions).forEach(key => {
                const [state, symbol] = key.split(',');
                const input = document.getElementById(`t-${state}-${symbol}`);
                if (input) input.value = result.transitions[key];
            });
            drawDiagram();
            showMessage('✅ Converted Regex to DFA', 'accept');
        }, 100);
    } catch (error) {
        showMessage('Error: ' + error, 'reject');
    }
}

// ===== TURING MACHINE FUNCTIONS =====
let tmTransitions = {}; // { 'state,symbol': 'nextState,write,dir' }

function initializeTMBuilder() {
    tmTransitions = {};
    renderTMList();
    showMessage('Transition builder ready! Add transitions using the form above.', 'info');
}

function addTMTransition() {
    const state = document.getElementById('tm-add-state').value.trim();
    const read  = document.getElementById('tm-add-read').value.trim();
    const write = document.getElementById('tm-add-write').value.trim();
    const dir   = document.getElementById('tm-add-dir').value;
    const next  = document.getElementById('tm-add-next').value.trim();

    if (!state || !read || !write || !next) {
        showMessage('Please fill all transition fields.', 'reject'); return;
    }

    const key = `${state},${read}`;
    tmTransitions[key] = `${next},${write},${dir}`;
    renderTMList();

    // clear inputs except direction
    ['tm-add-state','tm-add-read','tm-add-write','tm-add-next'].forEach(id => {
        document.getElementById(id).value = '';
    });
}

function deleteTMTransition(key) {
    delete tmTransitions[key];
    renderTMList();
}

function renderTMList() {
    const list = document.getElementById('tm-transitions-list');
    if (!list) return;
    if (Object.keys(tmTransitions).length === 0) {
        list.innerHTML = '<p class="hint" style="text-align:center;">No transitions added yet.</p>';
        return;
    }
    list.innerHTML = Object.entries(tmTransitions).map(([key, val]) => {
        const [state, read] = key.split(',');
        const [next, write, dir] = val.split(',');
        return `<div class="tm-row">
            <span class="tm-rule">(${state}, ${read}) → (${next}, ${write}, ${dir})</span>
            <button class="tm-del" onclick="deleteTMTransition('${key}')" title="Remove">✕</button>
        </div>`;
    }).join('');
}

function getTMTransitions() {
    return { ...tmTransitions };
}

function drawTMDiagram() {
    const states = document.getElementById('tm-states').value.split(',').map(s => s.trim()).filter(s => s);
    const startState = document.getElementById('tm-start').value.trim();
    const acceptState = document.getElementById('tm-accept').value.trim();
    const transitions = getTMTransitions();

    cy.elements().remove();

    states.forEach(state => {
        const classes = [];
        if (state === startState) classes.push('start');
        if (state === acceptState) classes.push('final');
        
        cy.add({
            group: 'nodes',
            data: { id: state, label: state },
            classes: classes.join(' ')
        });
    });

    const edgeMap = {};
    Object.keys(transitions).forEach(key => {
        const [state, symbol] = key.split(',');
        const [nextState, write, dir] = transitions[key].split(',');
        const edgeKey = `${state}-${nextState}`;
        const label = `${symbol}→${write},${dir}`;
        
        if (edgeMap[edgeKey]) {
            edgeMap[edgeKey] += `\n${label}`;
        } else {
            edgeMap[edgeKey] = label;
        }
    });

    Object.keys(edgeMap).forEach(edgeKey => {
        const [source, target] = edgeKey.split('-');
        cy.add({
            group: 'edges',
            data: { id: edgeKey, source, target, label: edgeMap[edgeKey] }
        });
    });

    cy.layout({ name: 'circle', animate: true, animationDuration: 500 }).run();
    showMessage('Turing Machine diagram drawn!', 'info');
}

async function simulateTM() {
    const inputString = document.getElementById('tm-input-string').value;
    const data = {
        states: document.getElementById('tm-states').value.split(',').map(s => s.trim()).filter(s => s),
        tape_alphabet: document.getElementById('tm-alphabet').value.split(',').map(s => s.trim()).filter(s => s),
        transitions: getTMTransitions(),
        start_state: document.getElementById('tm-start').value.trim(),
        accept_state: document.getElementById('tm-accept').value.trim(),
        reject_state: document.getElementById('tm-reject').value.trim(),
        input_string: inputString
    };

    try {
        const response = await fetch('/turing/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.error) {
            showMessage('Error: ' + result.error, 'reject');
        } else {
            const msg = result.accepted ? 
                `✅ ACCEPTED<br>Final tape: ${result.final_tape}<br>Steps: ${result.steps.length}` :
                `❌ REJECTED<br>Final tape: ${result.final_tape}<br>Steps: ${result.steps.length}`;
            document.getElementById('result').innerHTML = msg;
            document.getElementById('result').className = `result-box result-${result.accepted ? 'accept' : 'reject'}`;
        }
    } catch (error) {
        showMessage('Error: ' + error, 'reject');
    }
}

// ===== VISUAL EDITOR FUNCTIONS =====
let selectedElement = null;
let autoSyncEnabled = true;
let currentLoadedType = 'dfa'; // Track what type of automaton is currently loaded

function loadFromTab() {
    const source = document.getElementById('load-source').value;
    currentLoadedType = source;
    
    if (source === 'dfa') {
        loadCurrentDiagram();
    } else if (source === 'nfa') {
        loadNFADiagram();
    } else if (source === 'turing') {
        loadTMDiagram();
    }
}

function loadCurrentDiagram() {
    const states = document.getElementById('states').value.split(',').map(s => s.trim()).filter(s => s);
    const startState = document.getElementById('start-state').value.trim();
    const finalStates = document.getElementById('final-states').value.split(',').map(s => s.trim()).filter(s => s);
    const transitions = getTransitions();

    if (states.length === 0) {
        showEditorStatus('Please build a DFA first in the DFA tab', 'error');
        return;
    }

    cy.elements().remove();

    // Add nodes
    states.forEach(state => {
        const classes = [];
        if (state === startState) classes.push('start');
        if (finalStates.includes(state)) classes.push('final');
        
        cy.add({
            group: 'nodes',
            data: { id: state, label: state },
            classes: classes.join(' ')
        });
    });

    // Add edges
    const edgeMap = {};
    Object.keys(transitions).forEach(key => {
        const [state, symbol] = key.split(',');
        const target = transitions[key];
        const edgeKey = `${state}-${target}`;
        
        if (edgeMap[edgeKey]) {
            edgeMap[edgeKey] += `, ${symbol}`;
        } else {
            edgeMap[edgeKey] = symbol;
        }
    });

    Object.keys(edgeMap).forEach(edgeKey => {
        const [source, target] = edgeKey.split('-');
        cy.add({
            group: 'edges',
            data: { id: edgeKey, source, target, label: edgeMap[edgeKey] }
        });
    });

    cy.layout({ name: 'circle', animate: true, animationDuration: 500 }).run();
    showEditorStatus('DFA loaded! Edit it and save to any tab.', 'success');
}

function loadNFADiagram() {
    const states = document.getElementById('nfa-states').value.split(',').map(s => s.trim()).filter(s => s);
    const startState = document.getElementById('nfa-start').value.trim();
    const finalStates = document.getElementById('nfa-final').value.split(',').map(s => s.trim()).filter(s => s);
    const transitions = getNFATransitions();

    if (states.length === 0) {
        showEditorStatus('Please build an NFA first in the NFA tab', 'error');
        return;
    }

    cy.elements().remove();

    // Add nodes
    states.forEach(state => {
        const classes = [];
        if (state === startState) classes.push('start');
        if (finalStates.includes(state)) classes.push('final');
        
        cy.add({
            group: 'nodes',
            data: { id: state, label: state },
            classes: classes.join(' ')
        });
    });

    // Add edges for NFA (handle multiple targets)
    const edgeMap = {};
    Object.keys(transitions).forEach(key => {
        const [state, symbol] = key.split(',');
        const targets = transitions[key];
        targets.forEach(target => {
            const edgeKey = `${state}-${target}`;
            if (edgeMap[edgeKey]) {
                edgeMap[edgeKey] += `, ${symbol}`;
            } else {
                edgeMap[edgeKey] = symbol;
            }
        });
    });

    Object.keys(edgeMap).forEach(edgeKey => {
        const [source, target] = edgeKey.split('-');
        cy.add({
            group: 'edges',
            data: { id: edgeKey, source, target, label: edgeMap[edgeKey] }
        });
    });

    cy.layout({ name: 'circle', animate: true, animationDuration: 500 }).run();
    showEditorStatus('NFA loaded! Edit it and save to any tab.', 'success');
}

function loadTMDiagram() {
    const states = document.getElementById('tm-states').value.split(',').map(s => s.trim()).filter(s => s);
    const startState = document.getElementById('tm-start').value.trim();
    const acceptState = document.getElementById('tm-accept').value.trim();
    const transitions = getTMTransitions();

    if (states.length === 0) {
        showEditorStatus('Please build a TM first in the Turing Machine tab', 'error');
        return;
    }

    cy.elements().remove();

    // Add nodes
    states.forEach(state => {
        const classes = [];
        if (state === startState) classes.push('start');
        if (state === acceptState) classes.push('final');
        
        cy.add({
            group: 'nodes',
            data: { id: state, label: state },
            classes: classes.join(' ')
        });
    });

    // Add edges for TM
    const edgeMap = {};
    Object.keys(transitions).forEach(key => {
        const [state, symbol] = key.split(',');
        const [nextState, write, dir] = transitions[key].split(',');
        const edgeKey = `${state}-${nextState}`;
        const label = `${symbol}→${write},${dir}`;
        
        if (edgeMap[edgeKey]) {
            edgeMap[edgeKey] += `\n${label}`;
        } else {
            edgeMap[edgeKey] = label;
        }
    });

    Object.keys(edgeMap).forEach(edgeKey => {
        const [source, target] = edgeKey.split('-');
        cy.add({
            group: 'edges',
            data: { id: edgeKey, source, target, label: edgeMap[edgeKey] }
        });
    });

    cy.layout({ name: 'circle', animate: true, animationDuration: 500 }).run();
    showEditorStatus('Turing Machine loaded! Edit it and save to any tab.', 'success');
}

function saveToTab() {
    const target = document.getElementById('save-target').value;
    
    if (target === 'dfa') {
        saveToDFA();
    } else if (target === 'nfa') {
        saveToNFA();
    } else if (target === 'turing') {
        saveToTM();
    }
}

function saveToDFA() {
    const states = [];
    const alphabet = new Set();
    let startState = '';
    const finalStates = [];
    const transitions = {};
    
    cy.nodes().forEach(node => {
        states.push(node.id());
        if (node.hasClass('start')) startState = node.id();
        if (node.hasClass('final')) finalStates.push(node.id());
    });
    
    cy.edges().forEach(edge => {
        const source = edge.source().id();
        const target = edge.target().id();
        const labels = edge.data('label').split(',').map(l => l.trim());
        
        labels.forEach(symbol => {
            // Skip TM-style transitions for DFA
            if (!symbol.includes('→')) {
                alphabet.add(symbol);
                transitions[`${source},${symbol}`] = target;
            }
        });
    });
    
    // Update DFA tab inputs
    document.getElementById('states').value = states.join(',');
    document.getElementById('alphabet').value = Array.from(alphabet).join(',');
    document.getElementById('start-state').value = startState;
    document.getElementById('final-states').value = finalStates.join(',');
    
    // Regenerate table and fill transitions
    generateTable();
    setTimeout(() => {
        Object.keys(transitions).forEach(key => {
            const [state, symbol] = key.split(',');
            const input = document.getElementById(`t-${state}-${symbol}`);
            if (input) input.value = transitions[key];
        });
        showEditorStatus('Saved to DFA tab successfully!', 'success');
    }, 100);
}

function saveToNFA() {
    const states = [];
    const alphabet = new Set();
    let startState = '';
    const finalStates = [];
    const transitions = {};
    
    cy.nodes().forEach(node => {
        states.push(node.id());
        if (node.hasClass('start')) startState = node.id();
        if (node.hasClass('final')) finalStates.push(node.id());
    });
    
    cy.edges().forEach(edge => {
        const source = edge.source().id();
        const target = edge.target().id();
        const labels = edge.data('label').split(',').map(l => l.trim());
        
        labels.forEach(symbol => {
            // Skip TM-style transitions for NFA
            if (!symbol.includes('→')) {
                alphabet.add(symbol);
                const key = `${source},${symbol}`;
                if (transitions[key]) {
                    transitions[key].push(target);
                } else {
                    transitions[key] = [target];
                }
            }
        });
    });
    
    // Update NFA tab inputs
    document.getElementById('nfa-states').value = states.join(',');
    document.getElementById('nfa-alphabet').value = Array.from(alphabet).join(',');
    document.getElementById('nfa-start').value = startState;
    document.getElementById('nfa-final').value = finalStates.join(',');
    
    // Regenerate table and fill transitions
    generateNFATable();
    setTimeout(() => {
        Object.keys(transitions).forEach(key => {
            const [state, symbol] = key.split(',');
            const input = document.getElementById(`nfa-t-${state}-${symbol}`);
            if (input) input.value = transitions[key].join(',');
        });
        showEditorStatus('Saved to NFA tab successfully!', 'success');
    }, 100);
}

function saveToTM() {
    const states = [];
    let startState = '';
    let acceptState = '';
    const newTransitions = {};
    
    cy.nodes().forEach(node => {
        states.push(node.id());
        if (node.hasClass('start')) startState = node.id();
        if (node.hasClass('final')) acceptState = node.id();
    });
    
    cy.edges().forEach(edge => {
        const source = edge.source().id();
        const target = edge.target().id();
        const labels = edge.data('label').split('\n');
        
        labels.forEach(label => {
            // Parse TM-style transitions: symbol→write,dir
            if (label.includes('→')) {
                const [readPart, writePart] = label.split('→');
                const [write, dir] = writePart.split(',');
                const key = `${source},${readPart.trim()}`;
                newTransitions[key] = `${target},${write.trim()},${dir.trim()}`;
            }
        });
    });
    
    // Update TM tab inputs
    document.getElementById('tm-states').value = states.join(',');
    document.getElementById('tm-start').value = startState;
    document.getElementById('tm-accept').value = acceptState;
    
    // Update TM transitions
    tmTransitions = { ...newTransitions };
    renderTMList();
    showEditorStatus('Saved to Turing Machine tab successfully!', 'success');
}

function generateDiagramImage() {
    if (cy.elements().length === 0) {
        showEditorStatus('No diagram to export. Load a diagram first.', 'error');
        return;
    }

    const png = cy.png({
        output: 'blob',
        bg: '#FDFBF7',
        full: true,
        scale: 2
    });

    const url = URL.createObjectURL(png);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'automaton-diagram.png';
    link.click();
    URL.revokeObjectURL(url);
    
    showEditorStatus('Diagram image downloaded!', 'success');
}

function showEditorStatus(message, type) {
    const status = document.getElementById('editor-status');
    if (!status) return;
    
    status.style.display = 'block';
    status.className = `result-box result-${type === 'error' ? 'reject' : type === 'success' ? 'accept' : 'info'}`;
    status.innerHTML = message;
}

function addStateVisually() {
    const stateName = document.getElementById('editor-state-name').value.trim();
    const isStart = document.getElementById('editor-is-start').checked;
    const isFinal = document.getElementById('editor-is-final').checked;
    
    if (!stateName) {
        showEditorStatus('Please enter a state name', 'error');
        return;
    }
    
    const classes = [];
    if (isStart) classes.push('start');
    if (isFinal) classes.push('final');
    
    cy.add({
        group: 'nodes',
        data: { id: stateName, label: stateName },
        classes: classes.join(' '),
        position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 }
    });
    
    document.getElementById('editor-state-name').value = '';
    document.getElementById('editor-is-start').checked = false;
    document.getElementById('editor-is-final').checked = false;
    showEditorStatus('State added! Remember to save when done.', 'success');
}

function addTransitionVisually() {
    const from = document.getElementById('editor-from').value.trim();
    const to = document.getElementById('editor-to').value.trim();
    const symbol = document.getElementById('editor-symbol').value.trim();
    
    if (!from || !to || !symbol) {
        showEditorStatus('Please fill all fields', 'error');
        return;
    }
    
    const edgeId = `${from}-${to}`;
    const existing = cy.getElementById(edgeId);
    
    if (existing.length > 0) {
        const currentLabel = existing.data('label');
        existing.data('label', currentLabel + ',' + symbol);
    } else {
        cy.add({
            group: 'edges',
            data: { id: edgeId, source: from, target: to, label: symbol }
        });
    }
    
    document.getElementById('editor-symbol').value = '';
    showEditorStatus('Transition added! Remember to save when done.', 'success');
}

function deleteSelected() {
    if (selectedElement) {
        selectedElement.remove();
        selectedElement = null;
        showEditorStatus('Element deleted! Remember to save when done.', 'success');
    } else {
        showEditorStatus('Please select an element first (click on it)', 'error');
    }
}

function clearDiagram() {
    if (confirm('Clear entire diagram?')) {
        cy.elements().remove();
        showEditorStatus('Diagram cleared! Remember to save when done.', 'success');
    }
}

function saveChangesToDFA() {
    saveToDFA();
    switchTab('dfa');
    drawDiagram();
    showMessage('Changes saved to DFA tab!', 'accept');
}

// Track selected element
cy.on('tap', 'node, edge', function(evt) {
    if (currentTab === 'editor') {
        selectedElement = evt.target;
        cy.elements().removeClass('selected');
        selectedElement.addClass('selected');
    }
});

// ===== AI ASSISTANT FUNCTIONS =====
async function analyzeAutomaton() {
    const states = document.getElementById('states').value.split(',').map(s => s.trim()).filter(s => s);
    const alphabet = document.getElementById('alphabet').value.split(',').map(s => s.trim()).filter(s => s);
    const transitions = getTransitions();
    const startState = document.getElementById('start-state').value.trim();
    const finalStates = document.getElementById('final-states').value.split(',').map(s => s.trim()).filter(s => s);
    
    document.getElementById('ai-response').innerHTML = '<p style="color: var(--accent);">🤖 AI is analyzing... Please wait.</p>';
    
    try {
        const response = await fetch('/ai/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                states,
                alphabet,
                transitions,
                start_state: startState,
                final_states: finalStates
            })
        });
        
        const result = await response.json();
        
        if (result.error) {
            document.getElementById('ai-response').innerHTML = `<p style="color: #fc8181;">❌ ${result.error}</p>`;
        } else {
            document.getElementById('ai-response').innerHTML = `
                <h4 style="color: #667eea; margin-bottom: 10px;">🤖 AI Analysis</h4>
                <div style="white-space: pre-wrap; line-height: 1.6;">${result.response}</div>
            `;
        }
    } catch (error) {
        document.getElementById('ai-response').innerHTML = `<p style="color: #fc8181;">❌ Error: ${error}</p>`;
    }
}

async function explainTransition() {
    const states = document.getElementById('states').value.split(',').map(s => s.trim()).filter(s => s);
    const alphabet = document.getElementById('alphabet').value.split(',').map(s => s.trim()).filter(s => s);
    const transitions = getTransitions();
    
    document.getElementById('ai-response').innerHTML = '<p style="color: var(--accent);">🤖 AI is explaining... Please wait.</p>';
    
    try {
        const response = await fetch('/ai/explain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ states, alphabet, transitions })
        });
        
        const result = await response.json();
        
        if (result.error) {
            document.getElementById('ai-response').innerHTML = `<p style="color: #fc8181;">❌ ${result.error}</p>`;
        } else {
            document.getElementById('ai-response').innerHTML = `
                <h4 style="color: #667eea; margin-bottom: 10px;">🤖 AI Explanation</h4>
                <div style="white-space: pre-wrap; line-height: 1.6;">${result.response}</div>
            `;
        }
    } catch (error) {
        document.getElementById('ai-response').innerHTML = `<p style="color: #fc8181;">❌ Error: ${error}</p>`;
    }
}

async function suggestOptimizations() {
    const states = document.getElementById('states').value.split(',').map(s => s.trim()).filter(s => s);
    const alphabet = document.getElementById('alphabet').value.split(',').map(s => s.trim()).filter(s => s);
    const transitions = getTransitions();
    const finalStates = document.getElementById('final-states').value.split(',').map(s => s.trim()).filter(s => s);
    
    document.getElementById('ai-response').innerHTML = '<p style="color: var(--accent);">🤖 AI is thinking... Please wait.</p>';
    
    try {
        const response = await fetch('/ai/optimize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ states, alphabet, transitions, final_states: finalStates })
        });
        
        const result = await response.json();
        
        if (result.error) {
            document.getElementById('ai-response').innerHTML = `<p style="color: #fc8181;">❌ ${result.error}</p>`;
        } else {
            document.getElementById('ai-response').innerHTML = `
                <h4 style="color: #667eea; margin-bottom: 10px;">🤖 AI Suggestions</h4>
                <div style="white-space: pre-wrap; line-height: 1.6;">${result.response}</div>
            `;
        }
    } catch (error) {
        document.getElementById('ai-response').innerHTML = `<p style="color: #fc8181;">❌ Error: ${error}</p>`;
    }
}

function whatIfAnalysis() {
    let analysis = '<h4 style="color: #667eea; margin-bottom: 10px;">🔍 What-If Analysis</h4>';
    analysis += '<p>Use the controls below to explore different scenarios:</p>';
    analysis += '<ul style="margin: 15px 0; padding-left: 20px;">';
    analysis += '<li><strong>Add a new state:</strong> See how it affects the automaton</li>';
    analysis += '<li><strong>Remove a state:</strong> Understand dependencies</li>';
    analysis += '<li><strong>Change a transition:</strong> See impact on accepted strings</li>';
    analysis += '<li><strong>Make state final:</strong> Expand accepted language</li>';
    analysis += '<li><strong>Remove final state:</strong> Restrict accepted language</li>';
    analysis += '</ul>';
    analysis += '<p style="color: #718096;">Select a scenario and enter details, then click "Run What-If"</p>';
    
    document.getElementById('ai-response').innerHTML = analysis;
}

async function runWhatIf() {
    const scenario = document.getElementById('whatif-scenario').value;
    const details = document.getElementById('whatif-details').value.trim();
    const states = document.getElementById('states').value.split(',').map(s => s.trim()).filter(s => s);
    const alphabet = document.getElementById('alphabet').value.split(',').map(s => s.trim()).filter(s => s);
    const transitions = getTransitions();
    const startState = document.getElementById('start-state').value.trim();
    const finalStates = document.getElementById('final-states').value.split(',').map(s => s.trim()).filter(s => s);
    
    if (!details) {
        document.getElementById('ai-response').innerHTML = '<p style="color: #fc8181;">❌ Please enter state name or details</p>';
        return;
    }
    
    document.getElementById('ai-response').innerHTML = '<p style="color: var(--accent);">🤖 AI is analyzing scenario... Please wait.</p>';
    
    const scenarioMap = {
        'add-state': `Adding a new state "${details}"`,
        'remove-state': `Removing state "${details}"`,
        'change-transition': `Changing transition involving "${details}"`,
        'add-final': `Making state "${details}" a final state`,
        'remove-final': `Removing "${details}" as a final state`
    };
    
    try {
        const response = await fetch('/ai/whatif', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                scenario: scenarioMap[scenario],
                details,
                states,
                alphabet,
                transitions,
                start_state: startState,
                final_states: finalStates
            })
        });
        
        const result = await response.json();
        
        if (result.error) {
            document.getElementById('ai-response').innerHTML = `<p style="color: #fc8181;">❌ ${result.error}</p>`;
        } else {
            document.getElementById('ai-response').innerHTML = `
                <h4 style="color: #667eea; margin-bottom: 10px;">🤖 AI What-If Analysis</h4>
                <div style="white-space: pre-wrap; line-height: 1.6;">${result.response}</div>
                <p style="margin-top: 15px; padding: 10px; background: #edf2f7; border-radius: 6px;">
                💡 <strong>Tip:</strong> Use the Visual Editor tab to make these changes and see the results immediately!
                </p>
            `;
        }
    } catch (error) {
        document.getElementById('ai-response').innerHTML = `<p style="color: #fc8181;">❌ Error: ${error}</p>`;
    }
}

async function askCustomQuestion() {
    const query = document.getElementById('custom-query').value.trim();
    
    if (!query) {
        document.getElementById('ai-response').innerHTML = '<p style="color: #fc8181;">❌ Please enter a question</p>';
        return;
    }
    
    const states = document.getElementById('states').value.split(',').map(s => s.trim()).filter(s => s);
    const alphabet = document.getElementById('alphabet').value.split(',').map(s => s.trim()).filter(s => s);
    const transitions = getTransitions();
    const startState = document.getElementById('start-state').value.trim();
    const finalStates = document.getElementById('final-states').value.split(',').map(s => s.trim()).filter(s => s);
    
    const automatonData = {
        states,
        alphabet,
        transitions,
        start_state: startState,
        final_states: finalStates
    };
    
    document.getElementById('ai-response').innerHTML = '<p style="color: var(--accent);">🤖 AI is thinking... Please wait.</p>';
    
    try {
        const response = await fetch('/ai/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query,
                automaton_data: JSON.stringify(automatonData)
            })
        });
        
        const result = await response.json();
        
        if (result.error) {
            document.getElementById('ai-response').innerHTML = `<p style="color: #fc8181;">❌ ${result.error}</p>`;
        } else {
            document.getElementById('ai-response').innerHTML = `
                <h4 style="color: #667eea; margin-bottom: 10px;">🤖 AI Response</h4>
                <div style="background: #edf2f7; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
                    <strong>Your Question:</strong> ${query}
                </div>
                <div style="white-space: pre-wrap; line-height: 1.6;">${result.response}</div>
            `;
        }
    } catch (error) {
        document.getElementById('ai-response').innerHTML = `<p style="color: #fc8181;">❌ Error: ${error}</p>`;
    }
}
