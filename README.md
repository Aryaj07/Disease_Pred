# Medical AI Assistant

A comprehensive medical AI assistant application that combines advanced language models with a modern web interface to provide medical assistance and information.

## Project Structure

```
├── frontend/                   # Next.js frontend application
│   ├── src/                   # Source code directory
│   ├── public/                # Static files
│   ├── components.json        # UI component configurations
│   ├── next.config.ts        # Next.js configuration
│   ├── package.json          # Frontend dependencies
│   ├── tailwind.config.ts    # Tailwind CSS configuration
│   └── tsconfig.json         # TypeScript configuration
│
├── backend/                   # Django backend application
│   ├── api/                  # API endpoints and logic
│   ├── finalyear/           # Django project settings
│   ├── manage.py            # Django management script
│   └── requirements.txt      # Python dependencies
│
├── .gitignore               # Git ignore rules
└── README.md               # Project documentation
```

## Technology Stack

### Frontend
- Next.js with TypeScript
- Tailwind CSS for styling
- Modern React patterns and hooks
- Type-safe API integration

### Backend
- Django REST Framework
- SQLite database (configurable)
- DeepSeek Medical AI model integration
- JWT authentication

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
   ```bash
   cd backend
   python -m venv hacker
   source hacker/bin/activate  # On Windows: .\hacker\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   - Copy `env.example` to `.env`
   - Update the values according to your setup

4. Run migrations and start the server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   # or
   yarn install
   ```

2. Set up environment variables:
   - Copy `env.example` to `.env.local`
   - Update the values according to your setup

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Features

- Medical query processing using advanced language models
- Interactive web interface for user queries
- Secure API endpoints for medical information retrieval
- Real-time response generation
- Type-safe frontend development
- Responsive and modern UI design
- Secure authentication system
- Configurable AI model parameters

## Development Guidelines

### Frontend Development
- Follow TypeScript best practices
- Use component-driven development
- Implement responsive design
- Write clean, documented code
- Follow the established project structure

### Backend Development
- Follow Django REST framework conventions
- Document API endpoints
- Write unit tests for new features
- Keep the AI model integration modular
- Follow PEP 8 style guidelines

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Environment Variables

### Backend Variables
```
DJANGO_SECRET_KEY=your_django_secret_key_here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
MODEL_PATH=./DeepSeek-1.5B-Medical
DEVICE=cuda
```

### Frontend Variables
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Medical AI Assistant
```