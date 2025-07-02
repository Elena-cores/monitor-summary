# Image Processing Monitor for Cryo-Electron Microscopy

## Project Description

Monitor Summary is a web application that reads processed information from one or more live data sources from a microscope and generates a structured report on the acquisition status, allowing the operator to monitor a cryo-electron microscopy session in real time.

The goal is to provide a structured summary of the acquisition status, allowing users to monitor the progress of the session and detect potential issues early. The backend is built with Django and Django REST Framework (DRF) to handle API requests, while the frontend is developed using **React with Vite** for a fast and interactive user experience.

## Technologies Used

### Backend
- **Django**: Python web framework for backend development.
- **Django REST Framework (DRF)**: For building the REST API.
- **SQLite**: Lightweight database.

### Frontend
- **React**: JavaScript library for building user interfaces.
- **Vite**: Build tool for fast and efficient development.
- **Axios**: For making HTTP requests to the API.

## Project Setup

### Backend

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Elena-cores/monitor-summary.git
2. **Install python and pip (linux)**
    ```bash
    sudo apt update
    sudo apt install python3 python3-pip
3. **Create a virtual environment & install dependencies**:
    ```bash
   cd monitor-summary/cryoem_api
   python -m venv venv
   source venv/bin/activate     or      cmd /k ".\env\Scripts\activate.bat" 
4. **Apply migrations**
    ```bash
    python manage.py migrate
5. **Start the development server**
    ```bash
    python manage.py runserver
### Frontend
1. **Navigate to the frontend folder**:
   ```bash
   cd ../frontend
2. **Install dependencies**
    ```bash
    npm install
3. **Start the development server**
    ```bash
    npm run dev


## Importing Fake Data
To populate the database with automatically generated test data (useful for charts, views, and debugging), run one of the following scripts:
# Option 1: Run using Django shell
   ```bash
    python manage.py shell < cryoem_app/fake_data.py
```
### Option 2: Use standalone script (if available)
   ```bash
    python load_data.py
```

## Tests are available for both the backend (Django + DRF) and frontend (React + Vitest).

🔹 Backend (Django)

To run unit tests and API integration tests located in cryoem_app/tests/, use:
```bash
python manage.py test cryoem_app/tests
```
These tests cover the key models: Micrograph, CTF, and Config, and validate expected API behaviors.

🔹 Frontend (React + Vitest)

Inside the /frontend directory, run:
```bash
npm test
```
This will launch the component tests written using vitest and @testing-library/react.

### API Testing with Postman

- Testing collection: `/docs/postman/cryoem_api_tests.postman_collection.json`
- Import the file into Postman.
- Make sure the backend is running at `http://127.0.0.1:8000`.
- Remember to include your authentication token in the headers.


## Credits

This project was inspired by and developed in collaboration with the **Scipion team** and the **cryo-EM facility** at the Spanish National Centre for Biotechnology (CNB-CSIC) where I worked at.

**Scipion GitHub**

You can find the last built docs on https://scipion-em.github.io/docs/

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
