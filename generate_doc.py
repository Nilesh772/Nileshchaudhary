import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for margin_name, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{margin_name}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_document():
    doc = Document()

    # Page Margins (1 inch all around)
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    # Base Styles
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Calibri'
    font.size = Pt(11)
    font.color.rgb = RGBColor(30, 41, 59)

    # ---------------------------------------------------------
    # COVER / TITLE PAGE
    # ---------------------------------------------------------
    title_p = doc.add_paragraph()
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_p.paragraph_format.space_before = Pt(36)
    title_p.paragraph_format.space_after = Pt(12)
    run_sub = title_p.add_run("ACADEMIC LABORATORY MANUAL\n")
    run_sub.font.size = Pt(14)
    run_sub.font.bold = True
    run_sub.font.color.rgb = RGBColor(99, 102, 241)

    run_title = title_p.add_run("FULL STACK WEB DEVELOPMENT\nPRACTICAL LAB RECORD\n")
    run_title.font.size = Pt(24)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(15, 23, 42)

    run_desc = title_p.add_run("React.js, Express.js REST APIs & MongoDB Atlas Database")
    run_desc.font.size = Pt(13)
    run_desc.font.italic = True
    run_desc.font.color.rgb = RGBColor(100, 116, 139)

    doc.add_paragraph() # Spacer

    # Student Details Box
    student_table = doc.add_table(rows=5, cols=2)
    student_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    student_fields = [
        ("Course Name:", "Full Stack Web Application Development"),
        ("Student Name:", "_____________________________________________"),
        ("Enrollment / Roll No:", "_____________________________________________"),
        ("Department / Semester:", "Computer Science / Information Technology"),
        ("Academic Year:", "2024 - 2025")
    ]
    for i, (label, val) in enumerate(student_fields):
        row = student_table.rows[i]
        c0 = row.cells[0]
        c1 = row.cells[1]
        c0.width = Inches(2.2)
        c1.width = Inches(4.3)
        p0 = c0.paragraphs[0]
        r0 = p0.add_run(label)
        r0.bold = True
        r0.font.color.rgb = RGBColor(30, 41, 59)
        p1 = c1.paragraphs[0]
        r1 = p1.add_run(val)
        r1.font.color.rgb = RGBColor(71, 85, 105)

    doc.add_page_break()

    # ---------------------------------------------------------
    # INDEX TABLE
    # ---------------------------------------------------------
    h_idx = doc.add_heading("INDEX OF PRACTICALS", level=1)
    h_idx.paragraph_format.space_after = Pt(14)

    index_table = doc.add_table(rows=8, cols=4)
    index_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    index_headers = ["Prac. No.", "Practical Title", "Technology", "Sign / Grade"]
    col_widths = [Inches(1.0), Inches(3.6), Inches(1.3), Inches(1.1)]

    # Header Row
    hdr_row = index_table.rows[0]
    for idx, text in enumerate(index_headers):
        cell = hdr_row.cells[idx]
        cell.width = col_widths[idx]
        set_cell_background(cell, "1E293B")
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(text)
        r.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        r.font.size = Pt(10)

    practicals_meta = [
        ("1", "Build a React application using Functional Components, JSX and Component Reusability concepts.", "React.js"),
        ("2", "Develop a React application implementing Props, State Management and Event Handling.", "React.js"),
        ("3", "Create a Student Management System using React Forms, Controlled Components and Validation.", "React.js"),
        ("4", "Develop a Single Page Application (SPA) using React Router for navigation between multiple pages.", "React Router"),
        ("5", "Create a backend server using Express.js implementing routing and CRUD operation.", "Express.js"),
        ("6", "Build RESTful APIs for Student Records Management using Express.js and Postman testing.", "Express.js / Postman"),
        ("7", "Develop an Employee Management API integrating Express.js with MongoDB Atlas.", "Express + MongoDB")
    ]

    for i, (num, title, tech) in enumerate(practicals_meta, start=1):
        row = index_table.rows[i]
        bg = "F8FAFC" if i % 2 == 1 else "FFFFFF"
        for c_idx, cell in enumerate(row.cells):
            cell.width = col_widths[c_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=80, bottom=80, left=100, right=100)

        # Col 0: No
        p0 = row.cells[0].paragraphs[0]
        p0.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r0 = p0.add_run(num)
        r0.bold = True

        # Col 1: Title
        p1 = row.cells[1].paragraphs[0]
        p1.add_run(title)

        # Col 2: Tech
        p2 = row.cells[2].paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p2.add_run(tech)

        # Col 3: Sign
        p3 = row.cells[3].paragraphs[0]
        p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p3.add_run("")

    doc.add_page_break()

    # ---------------------------------------------------------
    # DETAILS FOR EACH PRACTICAL
    # ---------------------------------------------------------
    practicals_content = [
        {
            "num": "1",
            "title": "Build a React application using Functional Components, JSX and Component Reusability concepts.",
            "file": "Practical-1.jsx",
            "aim": "To understand the core architecture of React.js by developing an interactive web interface using Functional Components, JSX expressions, and reusable UI components (Button, Card, Badge, Header).",
            "theory": (
                "1. Functional Components: Modern React applications exclusively favor Functional Components over legacy Class Components. "
                "A functional component is a plain JavaScript function that receives an optional 'props' object and returns JSX.\n\n"
                "2. JSX (JavaScript XML): An XML/HTML-like syntax extension for JavaScript. Behind the scenes, Babel compiles JSX to React.createElement() function calls. "
                "JSX allows developers to evaluate JavaScript expressions inside curly braces {}, conditionally render elements, and handle inline style objects.\n\n"
                "3. Component Reusability: A fundamental principle of software engineering (DRY - Don't Repeat Yourself). "
                "Instead of duplicating markup and logic across different parts of an application, atomic components like Button and Card are designed to accept configurable props "
                "(such as variant, size, title, icon, onClick callbacks) so that a single component definition can be rendered in multiple contexts with diverse appearances and behaviors."
            ),
            "execution": "1. Import Practical-1.jsx into your React workspace (e.g. App.jsx).\n2. Run the development server with 'npm run dev'.\n3. Observe the modular navbar, hero section, and reusable cards rendered dynamically using array mapping.",
            "viva": [
                ("Q1: What is the difference between a Functional Component and a Class Component?",
                 "Ans: Functional components are simpler JavaScript functions that use React Hooks (like useState) for state and lifecycle operations. Class components require extending React.Component and managing the 'this' context."),
                ("Q2: Why must JSX return a single parent element or Fragment?",
                 "Ans: Because JSX translates to React.createElement(), which is a standard JavaScript function call that can only return one object or value. React Fragments (<>) allow grouping elements without adding extra nodes to the DOM."),
                ("Q3: What makes a component reusable in React?",
                 "Ans: A component is reusable when it decouples presentation logic from hardcoded data by accepting dynamic Props (such as labels, variants, styles, and event callbacks)."
                )
            ]
        },
        {
            "num": "2",
            "title": "Develop a React application implementing Props, State Management and Event Handling.",
            "file": "Practical-2.jsx",
            "aim": "To implement unidirectional data flow using Props, manage internal component state using the useState hook, and handle user events via SyntheticEvent listeners in React.",
            "theory": (
                "1. Props (Properties): Read-only data passed from a parent component down to child components. "
                "React enforces unidirectional (top-down) data flow, ensuring predictability.\n\n"
                "2. State Management (useState): While props are immutable from the child's perspective, State represents mutable data private to a component. "
                "When state updates via its setter function (e.g., setCount), React schedules a re-render of the component and its children.\n\n"
                "3. Event Handling: React implements a SyntheticEvent wrapper around native browser events, ensuring cross-browser compatibility. "
                "Events are declared using camelCase (onClick, onChange, onSubmit) and accept callback functions. "
                "Child components communicate back to parent components by invoking callback functions passed down as props (state lifting)."
            ),
            "execution": "1. Import Practical-2.jsx.\n2. Interact with the Counter (+, -, Reset, Step selection) and observe state changes.\n3. Add and toggle items in the task manager to witness form submission, input binding, and live event tracking.",
            "viva": [
                ("Q1: What is state lifting in React?",
                 "Ans: When multiple child components need to share or modify the same data, the state is lifted up to their common parent component, which passes the state and updater callbacks down as props."),
                ("Q2: What is a SyntheticEvent in React?",
                 "Ans: A SyntheticEvent is React's cross-browser wrapper around the browser's native event. It provides the same interface as the native event (e.g. stopPropagation(), preventDefault()) across all browsers."),
                ("Q3: Why shouldn't state be updated directly like 'this.state.count = 5'?",
                 "Ans: Direct mutation does not trigger a re-render of the component. State must always be updated using setter functions (setCount) so React can track dependencies and update the Virtual DOM."
                )
            ]
        },
        {
            "num": "3",
            "title": "Create a Student Management System using React Forms, Controlled Components and Validation.",
            "file": "Practical-3.jsx",
            "aim": "To build a robust student registration system utilizing Controlled Components, real-time client-side validation rules (regex, numerical limits, required checks), and dynamic directory management.",
            "theory": (
                "1. Controlled Components: In HTML, form elements like <input>, <textarea>, and <select> typically maintain their own internal state. "
                "In React, a Controlled Component's value is bound directly to React state (value={formData.name}), and updates are dispatched strictly via onChange handlers. "
                "This gives the developer complete control over the form data at every keystroke.\n\n"
                "2. Form Validation: Validating user inputs before sending them to a server is crucial. "
                "In this practical, multiple validation constraints are implemented:\n"
                "   - Non-empty alphabetic string validation for Full Name.\n"
                "   - Positive integer and uniqueness verification for Roll Number.\n"
                "   - Regular Expression (/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/) validation for email addresses.\n"
                "   - Bound checking for CGPA (between 0.0 and 10.0).\n"
                "   - Checkbox collection for technical skills.\n\n"
                "3. Dynamic Data Grid: Once validated, newly registered student records are stored in array state and displayed in a real-time searchable table."
            ),
            "execution": "1. Render Practical-3.jsx.\n2. Attempt submitting an empty form to observe red validation error prompts.\n3. Enter valid student details and submit. The record will appear in the table with search and delete functionality.",
            "viva": [
                ("Q1: What is the primary advantage of Controlled Components over Uncontrolled Components?",
                 "Ans: Controlled components provide immediate access to form values, enabling instant inline validation, conditional submit disabling, formatted input enforcement, and synchronized state."),
                ("Q2: How do you handle multiple input fields using a single handleChange function?",
                 "Ans: By giving each input element a 'name' attribute matching the state property key and updating state dynamically using computed property names: setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))."),
                ("Q3: How does e.preventDefault() work in form submission?",
                 "Ans: It prevents the default browser action of reloading the entire web page upon form submission, allowing JavaScript to handle data asynchronously."
                )
            ]
        },
        {
            "num": "4",
            "title": "Develop a Single Page Application (SPA) using React Router for navigation between multiple pages.",
            "file": "Practical-4.jsx",
            "aim": "To develop a Single Page Application with client-side navigation between multiple views (Home, About, Courses, Course Detail with dynamic route parameters, Contact, and 404 Not Found) without full page reloads.",
            "theory": (
                "1. Single Page Application (SPA): An application that loads a single HTML page and dynamically rewrites the DOM as the user interacts with the app, "
                "providing a fast, fluid desktop-like user experience without requesting new HTML documents from a server.\n\n"
                "2. React Router Architecture: React Router conditionally renders components based on the browser's current URL path. Key primitives include:\n"
                "   - BrowserRouter: Supplies HTML5 History API routing context.\n"
                "   - Routes & Route: Defines path matching patterns (e.g. /courses/:courseId).\n"
                "   - Link & NavLink: Renders accessible navigation anchors that update the route without page refreshes.\n"
                "   - useNavigate Hook: Programmatically switches routes upon button clicks or form submissions.\n"
                "   - useParams Hook: Extracts dynamic URL segment parameters (e.g., courseId) for data fetching and view customization.\n\n"
                "3. Wildcard Catch-all (*): Handles undefined routes by rendering a custom 404 Not Found page."
            ),
            "execution": "1. Render Practical-4.jsx.\n2. Click between Home, About, Courses, and Contact in the navbar.\n3. Click 'View Details' on any course card to inspect dynamic routing (/courses/cs101).\n4. Click 'Test 404' to observe custom fallback routing.",
            "viva": [
                ("Q1: What is the key difference between an SPA and a traditional Multi-Page Application (MPA)?",
                 "Ans: In an MPA, every page transition triggers a complete HTTP request to the server, resulting in a full page reload. In an SPA, only the required data or component tree is fetched and re-rendered in the browser."),
                ("Q2: How do dynamic route parameters work in React Router?",
                 "Ans: Route paths can define colon-prefixed segments like '/courses/:id'. When a URL like '/courses/cs101' matches, the useParams() hook extracts { id: 'cs101' }."),
                ("Q3: What is the difference between Link and NavLink in React Router?",
                 "Ans: NavLink is a specialized version of Link that automatically detects when its target path matches the active route, allowing developers to apply active styling or CSS classes.")
            ]
        },
        {
            "num": "5",
            "title": "Create a backend server using Express.js implementing routing and CRUD operation.",
            "file": "Practical-5.js",
            "aim": "To design and execute a robust backend server with Express.js that implements modular routing and all CRUD operations (Create, Read, Update, Delete) using standard HTTP methods.",
            "theory": (
                "1. Express.js: A minimal, flexible Node.js web application framework providing a robust set of features for web and mobile applications.\n\n"
                "2. Middleware: Functions that have access to the request object (req), response object (res), and next middleware function (next). "
                "Examples used: express.json() for parsing incoming JSON bodies, cors() for cross-origin resource sharing, and custom request loggers.\n\n"
                "3. CRUD Architecture & HTTP Methods:\n"
                "   - CREATE: HTTP POST /api/products (Adds a new resource and returns 201 Created)\n"
                "   - READ: HTTP GET /api/products & GET /api/products/:id (Retrieves collection or single item, returns 200 OK or 404 Not Found)\n"
                "   - UPDATE (Full): HTTP PUT /api/products/:id (Replaces the entire resource record)\n"
                "   - UPDATE (Partial): HTTP PATCH /api/products/:id (Modifies only specified fields)\n"
                "   - DELETE: HTTP DELETE /api/products/:id (Removes resource and returns 200 OK)\n\n"
                "4. Modular express.Router(): Segregates business endpoints into dedicated route handlers, maintaining clean code organization."
            ),
            "execution": "1. Run 'node Practical-5.js' in the terminal.\n2. Server starts at http://localhost:5000.\n3. Open a browser to http://localhost:5000 to see the API dashboard.\n4. Send GET, POST, PUT, DELETE requests using Postman or cURL.",
            "viva": [
                ("Q1: What is the difference between PUT and PATCH in REST APIs?",
                 "Ans: PUT is used for complete replacement of an existing resource (requires sending all mandatory fields), whereas PATCH is used for partial modification of specific fields."),
                ("Q2: What is the purpose of the 'next()' function in Express middleware?",
                 "Ans: The next() function passes control to the next middleware function in the execution stack. Without calling next(), the request hangs and never completes."),
                ("Q3: Which HTTP status code indicates successful resource creation?",
                 "Ans: HTTP Status Code 201 Created.")
            ]
        },
        {
            "num": "6",
            "title": "Build RESTful APIs for Student Records Management using Express.js and Postman testing.",
            "file": "Practical-6.js",
            "aim": "To architect an enterprise-grade RESTful API for managing Student Records using Express.js, enforce REST constraints, and validate all endpoints using automated Postman tests.",
            "theory": (
                "1. REST (Representational State Transfer): An architectural style for networked hypermedia applications based on statelessness, "
                "client-server separation, uniform resource identifiers (URIs), and standardized HTTP verbs.\n\n"
                "2. Endpoint Design:\n"
                "   - GET /api/v1/students: Collection endpoint with support for department filtering, minimum CGPA queries, and pagination.\n"
                "   - GET /api/v1/students/:id: Resource identification by unique integer.\n"
                "   - GET /api/v1/students/roll/:rollNo: Domain search by institutional roll number.\n"
                "   - POST /api/v1/students: Registration with schema validation and duplicate roll number rejection (HTTP 409 Conflict).\n"
                "   - PUT /api/v1/students/:id: Resource update.\n"
                "   - DELETE /api/v1/students/:id: Resource deletion.\n"
                "   - GET /api/v1/students/stats/analytics: Analytical summary endpoint.\n\n"
                "3. Postman Automated Testing: Postman tests allow validating response status codes (pm.response.to.have.status(200)), "
                "verifying JSON structure, and ensuring payload accuracy automatically."
            ),
            "execution": "1. Start server with 'node Practical-6.js' on port 5001.\n2. Open Postman application.\n3. Import 'Practical-6-Postman-Collection.json'.\n4. Execute the pre-configured test requests and observe status codes and JSON payloads.",
            "viva": [
                ("Q1: What makes an API 'RESTful'?",
                 "Ans: An API is RESTful when it adheres to REST constraints: Stateless communication, Client-Server separation, Cacheability, Uniform Interface (standard HTTP verbs), and Resource-based URIs."),
                ("Q2: Why is HTTP Status Code 409 Conflict used in POST requests?",
                 "Ans: Code 409 is returned when a client attempts to create a resource that violates a uniqueness constraint (e.g., duplicate Student Roll Number or Email)."),
                ("Q3: How do query parameters differ from route path parameters?",
                 "Ans: Path parameters (/:id) identify a specific resource. Query parameters (?department=CS&minCgpa=8.5) are used to filter, sort, or paginate collections.")
            ]
        },
        {
            "num": "7",
            "title": "Develop an Employee Management API integrating Express.js with MongoDB Atlas.",
            "file": "Practical-7.js",
            "aim": "To construct an Employee Management API connecting Express.js to MongoDB Atlas cloud database via Mongoose ODM, utilizing strict schemas, data validation, and aggregation pipelines.",
            "theory": (
                "1. MongoDB Atlas: A fully managed cloud database service that handles provisioning, scaling, and high availability of MongoDB clusters globally.\n\n"
                "2. Mongoose ODM (Object Data Modeling): Provides a schema-based solution to model application data. "
                "Features include schema types, custom validators, middleware hooks, and model methods.\n\n"
                "3. Mongoose Schema Features Implemented:\n"
                "   - Strict data types (String, Number, Date, Boolean, Array).\n"
                "   - Field-level validation: Required flags, minimum string lengths, regex email matching, and positive salary constraints.\n"
                "   - Enum restrictions on departments ('Engineering', 'Marketing', 'Human Resources', 'Finance', 'Design').\n"
                "   - Automated timestamps (createdAt, updatedAt).\n\n"
                "4. MongoDB Aggregation Pipeline: High-performance data processing framework using sequential stages ($group, $avg, $sum, $sort) "
                "to calculate department-wise employee counts, average salaries, and total budget expenditures."
            ),
            "execution": "1. Set MONGO_URI in .env or run with default connection string.\n2. Execute 'node Practical-7.js' on port 5002.\n3. The server connects to MongoDB Atlas (or activates resilient in-memory mode if credentials are unconfigured).\n4. Test CRUD endpoints and aggregation reports via http://localhost:5002/api/employees/reports/department-stats.",
            "viva": [
                ("Q1: What is an ODM and why do we use Mongoose with MongoDB?",
                 "Ans: ODM stands for Object Data Modeling. Mongoose provides a structured schema, built-in validation, type casting, query building, and middleware hooks over MongoDB's schema-less document structure."),
                ("Q2: What is the MongoDB Aggregation Pipeline?",
                 "Ans: A multi-stage processing pipeline where documents pass through stages ($match, $group, $sort, $project) to transform, group, and calculate aggregate metrics efficiently on the database server."),
                ("Q3: What is the purpose of 'runValidators: true' in Mongoose findOneAndUpdate?",
                 "Ans: By default, update operations bypass schema validation. Passing { runValidators: true } forces Mongoose to validate updated fields against the schema definition.")
            ]
        }
    ]

    for p_info in practicals_content:
        # Heading
        h = doc.add_heading(f"PRACTICAL NO. {p_info['num']}", level=1)
        h.paragraph_format.space_before = Pt(20)
        h.paragraph_format.space_after = Pt(6)

        p_title = doc.add_paragraph()
        r_t = p_title.add_run(p_info['title'])
        r_t.bold = True
        r_t.font.size = Pt(13)
        r_t.font.color.rgb = RGBColor(79, 70, 229)
        p_title.paragraph_format.space_after = Pt(12)

        # Aim
        h_aim = doc.add_heading("1. AIM / OBJECTIVE", level=2)
        h_aim.paragraph_format.space_before = Pt(10)
        p_aim = doc.add_paragraph(p_info['aim'])
        p_aim.paragraph_format.space_after = Pt(10)

        # Theoretical Background
        h_th = doc.add_heading("2. THEORETICAL CONCEPTS & ARCHITECTURE", level=2)
        h_th.paragraph_format.space_before = Pt(10)
        p_th = doc.add_paragraph(p_info['theory'])
        p_th.paragraph_format.space_after = Pt(12)

        # Source Code Section
        h_code = doc.add_heading(f"3. COMPLETE SOURCE CODE ({p_info['file']})", level=2)
        h_code.paragraph_format.space_before = Pt(10)

        # Read Code from File
        code_path = os.path.join(r"c:\CoBrotherTech_Projects\master", p_info['file'])
        code_text = ""
        if os.path.exists(code_path):
            with open(code_path, "r", encoding="utf-8") as f:
                code_text = f.read()
        else:
            code_text = f"// Code file {p_info['file']}"

        # Insert Code Box
        code_table = doc.add_table(rows=1, cols=1)
        code_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        code_cell = code_table.rows[0].cells[0]
        code_cell.width = Inches(6.5)
        set_cell_background(code_cell, "F1F5F9")
        set_cell_margins(code_cell, top=140, bottom=140, left=180, right=180)
        
        # Add code lines (limit to clean readable blocks)
        code_p = code_cell.paragraphs[0]
        code_p.paragraph_format.line_spacing = 1.05
        code_p.paragraph_format.space_after = Pt(0)
        r_c = code_p.add_run(code_text)
        r_c.font.name = 'Consolas'
        r_c.font.size = Pt(8.5)
        r_c.font.color.rgb = RGBColor(30, 41, 59)

        doc.add_paragraph() # Spacer

        # Execution Steps
        h_exec = doc.add_heading("4. EXECUTION INSTRUCTIONS & HOW TO RUN", level=2)
        h_exec.paragraph_format.space_before = Pt(12)
        p_exec = doc.add_paragraph(p_info['execution'])
        p_exec.paragraph_format.space_after = Pt(12)

        # Viva Voce Questions
        h_viva = doc.add_heading("5. LAB VIVA QUESTIONS & ANSWERS", level=2)
        h_viva.paragraph_format.space_before = Pt(12)
        for q, a in p_info['viva']:
            pq = doc.add_paragraph()
            rq = pq.add_run(q)
            rq.bold = True
            rq.font.color.rgb = RGBColor(15, 23, 42)
            pa = doc.add_paragraph()
            ra = pa.add_run(a)
            ra.font.italic = True
            ra.font.color.rgb = RGBColor(71, 85, 105)
            pa.paragraph_format.space_after = Pt(6)

        doc.add_page_break()

    output_path = r"c:\CoBrotherTech_Projects\master\All_Practicals_Documentation.docx"
    doc.save(output_path)
    print(f"Successfully created Word Document: {output_path}")

if __name__ == '__main__':
    create_document()
