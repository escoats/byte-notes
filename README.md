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
Supabase Auth for secure login and session management
Server-side rendering (SSR) for protected routes

### Hierarchical Notes
Notebooks → Chapters → Pages
Designed for structured learning and modular documentation

### Markdown Editor
Live editing with support for headings, lists, bold/italic, links, and more

### Code Compiler
Each page includes a live coding environment (StackBlitz or Monaco-based)
It supports multi-language execution (e.g., Python, JavaScript, etc.).
Save and load code snippets per page using Supabase

### Theme Support
Dark and light themes are available with full Tailwind support
Toggle via custom ThemeProvider and ThemeToggle components

### Published Page
Once a student finishes their notes they can share (via clipboard, email, or SMS) and publish the page 

### Viewers
Viewers are updated live using Supabase's real-time capabilties and profile pictures are displayed in an Avatar Stack

### Reactions 
Viewers can react to pages with a heart, star, or dislike 
Reaction counts are updated live using Supabase's real-time capabilities

### Viewers 
