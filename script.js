const BASE_URL = window.location.origin;

const authEmailInput = document.getElementById('authEmail');
const authPasswordInput = document.getElementById('authPassword');
const signupBtn = document.getElementById('signupBtn');
const loginBtn = document.getElementById('loginBtn');
const currentUserEmailSpan = document.getElementById('currentUserEmail');
const currentTokenSpan = document.getElementById('currentToken');

const blogTitleInput = document.getElementById('blogTitle');
const blogContentInput = document.getElementById('blogContent');
const createBlogBtn = document.getElementById('createBlogBtn');
const fetchBlogsBtn = document.getElementById('fetchBlogsBtn');
const blogsListDiv = document.getElementById('blogsList');

let userToken = localStorage.getItem('blogAppToken');
let userEmail = localStorage.getItem('blogAppEmail');

const updateAuthStatus = () => {
    if (userToken && userEmail) {
        currentUserEmailSpan.textContent = userEmail;
        currentTokenSpan.textContent = userToken.substring(0, 10) + '...'; // Show part of token
    } else {
        currentUserEmailSpan.textContent = 'Not logged in';
        currentTokenSpan.textContent = 'None';
    }
};

// --- Authentication ---
signupBtn.addEventListener('click', async () => {
    const email = authEmailInput.value;
    const password = authPasswordInput.value;
    try {
        const response = await fetch(`${BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            userToken = data.token;
            userEmail = data.email;
            localStorage.setItem('blogAppToken', userToken);
            localStorage.setItem('blogAppEmail', userEmail);
            alert(data.message);
            updateAuthStatus();
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('Failed to sign up.');
    }
});

loginBtn.addEventListener('click', async () => {
    const email = authEmailInput.value;
    const password = authPasswordInput.value;
    try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            userToken = data.token;
            userEmail = data.email;
            localStorage.setItem('blogAppToken', userToken);
            localStorage.setItem('blogAppEmail', userEmail);
            alert(data.message);
            updateAuthStatus();
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Failed to log in.');
    }
});

// --- Blog Posts ---
createBlogBtn.addEventListener('click', async () => {
    const title = blogTitleInput.value;
    const content = blogContentInput.value;
    if (!userToken) {
        alert('Please login first to create a blog post.');
        return;
    }
    try {
        const response = await fetch(`${BASE_URL}/api/blogs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ title, content })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Blog post created successfully!');
            blogTitleInput.value = '';
            blogContentInput.value = '';
            fetchBlogs(); // Refresh blog list
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Create blog error:', error);
        alert('Failed to create blog post.');
    }
});

fetchBlogsBtn.addEventListener('click', fetchBlogs);

async function fetchBlogs() {
    try {
        const response = await fetch(`${BASE_URL}/api/blogs`);
        const data = await response.json();
        if (response.ok) {
            blogsListDiv.innerHTML = ''; // Clear previous blogs
            if (data.blogs && data.blogs.length > 0) {
                data.blogs.forEach(blog => {
                    const blogElement = document.createElement('div');
                    blogElement.style.border = '1px solid #eee';
                    blogElement.style.padding = '10px';
                    blogElement.style.marginBottom = '10px';
                    blogElement.innerHTML = `
                        <h3>${blog.title}</h3>
                        <p>${blog.content}</p>
                        <small>By: ${blog.authorName} on ${new Date(blog.createdAt).toLocaleDateString()}</small>
                    `;
                    blogsListDiv.appendChild(blogElement);
                });
            } else {
                blogsListDiv.textContent = 'No blog posts yet.';
            }
        } else {
            blogsListDiv.textContent = `Error fetching blogs: ${data.message}`;
        }
    } catch (error) {
        console.error('Fetch blogs error:', error);
        blogsListDiv.textContent = 'Failed to fetch blogs.';
    }
}

// Initial load
updateAuthStatus();
fetchBlogs();