# Automata Studio

Professional web-based platform for building, visualizing, and simulating finite automata with AI-powered assistance.

## 🚀 Features

### Core Automata Tools
- **DFA Builder** - Create deterministic finite automata with step-by-step wizard
- **NFA Builder** - Build non-deterministic automata with epsilon transitions
- **Regular Expression Converter** - Convert regex to DFA automatically
- **Turing Machine Simulator** - Define and simulate Turing machines with formal notation

### Advanced Features
- **Visual Editor** - Interactive diagram editing with cross-format support
- **AI Assistant** - Groq-powered intelligent analysis and insights
- **Automata Library** - Pre-built examples for common languages and patterns
- **Professional UI** - Modern, clean interface with warm academic theme

### Analysis & Operations
- **DFA Validation** - Check automaton correctness
- **DFA Minimization** - Reduce states automatically
- **Unreachable State Detection** - Find and remove dead states
- **NFA to DFA Conversion** - Subset construction algorithm
- **String Testing** - Simulate input strings with visual animation

## 🎯 Quick Start

### Prerequisites
- Python 3.7+
- Groq API key (get from https://console.groq.com/keys)

### Installation

1. **Clone or download the project**
```bash
cd Automata_Studio
```

2. **Set up environment**
```bash
# Windows
setx GROQ_API_KEY "your_key_here"

# Linux/Mac
export GROQ_API_KEY="your_key_here"
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Run application**
```bash
# Windows
START.bat

# Or manually
python app.py
```

5. **Open browser**
```
http://127.0.0.1:5000
```

## 📚 Usage Guide

### Building a DFA
1. **Define States & Alphabet**
   - Enter comma-separated states: `q0,q1,q2`
   - Enter alphabet symbols: `0,1`
   - Set start state and final states

2. **Fill Transition Table**
   - Click "Generate Transition Table"
   - Fill each cell with next state
   - Click "Draw Diagram"

3. **Test Your Automaton**
   - Enter test string in simulator
   - Watch animated execution
   - See accept/reject result

### Building an NFA
1. **Similar to DFA but with differences:**
   - Multiple transitions allowed per cell
   - Epsilon (ε) transitions supported
   - Separate with commas: `q1,q2`

### Regular Expression to DFA
1. **Enter regex pattern**
   - Use operators: `*` (Kleene star), `|` (union), `()` (grouping)
   - Examples: `(0|1)*01`, `a*b*`, `(ab)*`

2. **Convert automatically**
   - Click "Convert to DFA"
   - Result appears in DFA tab

### Turing Machine Builder
1. **Define formal components**
   - Q (states), Σ (input alphabet), Γ (tape alphabet)
   - q₀ (start), qaccept, qreject

2. **Add transitions using builder**
   - Current state + read symbol → next state + write + direction
   - Example: `(q0, a) → (q1, X, R)`

3. **Simulate with input strings**

### Visual Editor
1. **Load from any tab**
   - Choose source: DFA/NFA/Turing Machine
   - Edit interactively with mouse

2. **Add/Edit elements**
   - Add states with start/final properties
   - Add transitions between states
   - Delete selected elements

3. **Save to any format**
   - Convert between DFA/NFA/TM formats
   - Export diagrams as PNG images

### Library Examples
Ready-to-use examples for learning:

**DFA Examples:**
- Strings ending with "01"
- Even number of 0s
- Contains substring "101"
- Length divisible by 3

**NFA Examples:**
- Ends with "01" or "10"
- Third symbol from end is 1

**Turing Machine Examples:**
- aⁿbⁿ (equal a's and b's)
- aⁿbⁿcⁿ (three equal groups)
- Palindrome checker
- Binary increment (+1)
- String repetition (ww)

### AI Assistant
1. **Quick Analysis**
   - Analyze automaton structure
   - Explain transitions
   - Suggest optimizations

2. **Custom Questions**
   - Ask about accepted languages
   - Get implementation help
   - Understand complexity

3. **What-If Scenarios**
   - Add/remove states
   - Change transitions
   - See impact analysis

## 🏗️ Project Structure

```
Automata_Studio/
├── app.py                 # Flask backend server
├── ai_agent.py           # Groq AI integration
├── dfa_engine.py         # DFA logic & algorithms
├── nfa_engine.py         # NFA logic & conversion
├── regex_engine.py       # Regex to DFA converter
├── turing_engine.py      # Turing machine simulator
├── requirements.txt      # Python dependencies
├── START.bat            # Windows startup script
├── README.md            # This file
├── templates/
│   └── index.html       # Main UI template
└── static/
    ├── css/
    │   └── academic.css # Professional styling
    └── js/
        └── app.js       # Frontend JavaScript logic
```

## 🛠️ Technology Stack

### Backend
- **Python 3.7+** - Core language
- **Flask** - Web framework
- **Flask-CORS** - Cross-origin support
- **Groq API** - AI assistant (Llama 3.1)

### Frontend
- **HTML5** - Structure
- **CSS3** - Professional academic styling
- **JavaScript (ES6+)** - Interactive functionality
- **Cytoscape.js** - Graph visualization

### Fonts & Design
- **Poppins** - Primary UI font
- **Montserrat** - Headers and emphasis
- **Warm Academic Theme** - Cream/white professional colors

## 🎨 Design Philosophy

### User Experience
- **Step-by-step wizards** for complex tasks
- **Visual feedback** with animations
- **Professional appearance** suitable for academic use
- **Cross-format compatibility** between automaton types

### Educational Focus
- **Formal notation** (Q, Σ, Γ, δ) for Turing Machines
- **Comprehensive examples** for common languages
- **AI explanations** for learning support
- **Interactive exploration** with What-If scenarios

## 🔧 API Endpoints

### DFA Operations
- `POST /simulate` - Simulate DFA with input string
- `POST /validate` - Validate DFA structure
- `POST /minimize` - Minimize DFA states
- `POST /unreachable` - Find unreachable states

### NFA Operations
- `POST /nfa/simulate` - Simulate NFA
- `POST /nfa/to-dfa` - Convert NFA to DFA

### Other Operations
- `POST /regex/to-dfa` - Convert regex to DFA
- `POST /turing/simulate` - Simulate Turing Machine

### AI Assistant
- `POST /ai/analyze` - Analyze automaton
- `POST /ai/explain` - Explain transitions
- `POST /ai/optimize` - Suggest optimizations
- `POST /ai/whatif` - What-if analysis
- `POST /ai/query` - Custom questions

## 🚀 Advanced Features

### Visual Editor Capabilities
- **Universal Loading** - Load from DFA/NFA/TM tabs
- **Cross-format Saving** - Save to any automaton type
- **Interactive Editing** - Click to edit states/transitions
- **PNG Export** - High-quality diagram images

### Library System
- **Categorized Examples** - DFA, NFA, Regex, TM
- **One-click Loading** - Instant example import
- **Educational Descriptions** - How each example works
- **Complexity Indicators** - Regular vs context-free languages

### AI Integration
- **Context-aware Analysis** - Understands your specific automaton
- **Educational Explanations** - Beginner-friendly responses
- **Optimization Suggestions** - Performance improvements
- **Scenario Modeling** - Explore changes safely

## 🎓 Educational Use Cases

### Computer Science Courses
- **Theory of Computation** - DFA/NFA/TM construction
- **Formal Languages** - Regular expression practice
- **Algorithm Design** - State minimization algorithms
- **Complexity Theory** - Language hierarchy exploration

### Self-Learning
- **Interactive Examples** - Learn by doing
- **AI Tutoring** - Get explanations on demand
- **Visual Understanding** - See how automata work
- **Progressive Complexity** - Start simple, advance gradually

## 🔒 Security & Privacy

- **No data storage** - All work stays in your browser
- **API key security** - Groq key stored as environment variable
- **Local processing** - Automata logic runs locally
- **Open source** - Transparent implementation

## 🐛 Troubleshooting

### Common Issues

**"AI features not working"**
- Check GROQ_API_KEY environment variable
- Verify API key is valid at console.groq.com
- Restart application after setting key

**"Diagram not displaying"**
- Ensure states and alphabet are filled
- Check transition table is complete
- Try refreshing the page

**"Visual Editor not loading"**
- Build automaton in source tab first
- Select correct load source
- Check browser console for errors

### Performance Tips
- **Large automata** - Use minimization feature
- **Complex diagrams** - Export as PNG for sharing
- **Slow AI responses** - Check internet connection

## 📄 License

Open-source for educational purposes. Feel free to use, modify, and distribute for learning and teaching automata theory.

## 👨‍💻 Author

Built for learning and teaching automata theory with modern web technologies and AI assistance.

## 🙏 Acknowledgments

- **Cytoscape.js** - Graph visualization library
- **Groq** - AI API for intelligent assistance
- **Flask** - Python web framework
- **Academic Community** - Inspiration for educational tools

---

**Happy Learning! 🎓**

Build, visualize, and understand automata with the power of AI assistance.