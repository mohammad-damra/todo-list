document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if(response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = '/home.html';
        } else {
            document.getElementById('errorMsg').textContent = data.message;
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        
        if(response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = '/home.html';
        } else {
            document.getElementById('errorMsg').textContent = data.message;
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});
