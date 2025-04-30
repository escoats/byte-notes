# BYTE NOTES 🍪

> Developed by [Caitlin Estrada](https://github.com/caitlinestrada27), [Elizabeth (Lizzie) Coats](https://github.com/escoats), [Sanjana Gopalswamy](https://github.com/sgopal08), and [Yi (Charlotte) Tsui](https://github.com/charlottetsui) for COMP 426: Modern Web Programming at UNC-Chapel Hill.


![TypeScript](https://img.shields.io/badge/-TypeScript-05122A?style=flat&logo=typescript)
![Next.js](https://img.shields.io/badge/-Next.js-05122A?style=flat&logo=nextdotjs)
![Shadcn/ui](https://img.shields.io/badge/-Shadcn_UI-05122A?style=flat&logo=shadcnui)
![Tailwind](https://img.shields.io/badge/-Tailwind-05122A?style=flat&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/-Supabase-05122A?style=flat&logo=supabase)

ByteNotes is a full-stack web application created by Computer Science for Computer Science students to facilitate efficient and organized note-taking in higher-level courses.

## Features

### Authentication
Supabase Auth for secure login and session management <br>
Server-side rendering (SSR) for protected routes <br>

### Hierarchical Notes
Notebooks → Chapters → Pages <br>
Designed for structured learning and modular documentation <br>

### Markdown Editor
Live editing with support for headings, lists, bold/italic, links, and more <br>

### Code Compiler
Each page includes a live coding environment (StackBlitz) <br>
It supports multi-language execution (e.g., Python, JavaScript, etc.) <br>
Save and load code snippets per page using Supabase <br>

### Theme Support
Dark and light themes are available with full Tailwind support <br>
Toggle via custom ThemeProvider and ThemeToggle components <br>

### Published Page
Once a student finishes their notes they can share (via clipboard, email, or SMS) and publish the page <br>

### Viewers
Viewers are updated live using Supabase's real-time capabilities and profile pictures are displayed in an Avatar Stack <br>

### Reactions 
Viewers can react to pages with a heart, star, or dislike <br>
Reaction counts are updated live using Supabase's real-time capabilities
