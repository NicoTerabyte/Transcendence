import { authService } from "../services/authService.js";
import { navigateTo } from '../router.js';
import { showAlert } from '../components/alert.js';

export function renderLoginPage() {
  const root = document.getElementById("root");
  root.innerHTML = ""; // Clear previous content

   // Add required CSS
  const style = document.createElement('style');
  style.textContent = `
    .cascading-right {
      margin-right: -50px;
    }
    @media (max-width: 991.98px) {
      .cascading-right {
        margin-right: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Add login form
  const section = document.createElement('section');
  section.className = 'text-center text-lg-start';

  // Create container structure
  const container = `
    <div class="container py-4 align-items-center">
      <div class="row g-0 align-items-center justify-content-center">
        <div class="col-lg-6 mb-5 mb-lg-0">
          <div class="card cascading-right bg-body-tertiary text-center" style="backdrop-filter: blur(30px);"  id="login-card">
            <div class="card-body p-5 shadow-10 text-center">
              <h2 class="fw-bold mb-5">Welcome Back</h2>
              <form id="login-form">
                <div class="form-outline mb-4">
                  <label class="form-label" for="username">Username or Email</label>
                  <input type="text"
                         id="username"
                         class="form-control"
                         required
                         autocomplete="username email" />
                </div>

                <div class="form-outline mb-4">
                  <label class="form-label" for="password">Password</label>
                  <input type="password"
                         id="password"
                         class="form-control"
                         required
                         autocomplete="current-password" />
                </div>

                <button type="submit" class="btn btn-primary btn-block mb-4">
                  Log in
                </button>

                <div class="text-center">
                  <p>or log in with:</p>
                  <button type="button" class="btn btn-link btn-floating mx-1" id="oauth-42">
                    <img src="/assets/42_Logo.svg.png" alt="42 Logo" style="width: 20px; height: 20px;">
                  </button>
                </div>
              </form>
            </div>
            <p class="mb-5">Don't have an account yet? <a href="/signup" class="fw-bold">Signup</a></p>
          </div>
        </div>
        <div class="col-lg-6 mb-5 mb-lg-0 d-none d-lg-block">
          <img src="/assets/846-02793586en_Masterfile.jpg" class="w-100 rounded-4 shadow-4" alt="Login background" />
        </div>
      </div>
    </div>
  `;

  section.innerHTML = container;
  root.appendChild(section);

  const oauthButton = document.getElementById('oauth-42');
  oauthButton.addEventListener('click', async () => {
    const result = await authService.oauth42Login();
    if (result.success) {
        window.location.href = result.url;
    } else {
        console.error('Error:', result.error);
        showAlert('Servers are busy, try again!');
    }
  });

  // Add form submission handler
  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username_or_email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const result = await authService.login(username_or_email, password);
    if (result.success) {
      navigateTo("/");
    }
    else {
      console.error('Login failed:', result.error);
      showAlert(data.error || 'Login failed. Please try again.');
    }
  });
}
