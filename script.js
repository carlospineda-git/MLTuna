/* --- ML TUNA AUTH SCRIPT --- */

document.addEventListener("DOMContentLoaded", () => {
    const signUpBtn = document.getElementById("signUpBtn");
    const themeToggle = document.getElementById("themeToggle");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const status = document.getElementById("status");
    const btnText = document.querySelector(".btn-text");

    // --- TOKEN HANDLING ---
    function getToken() {
        const params = new URLSearchParams(window.location.search);
        return params.get("token");
    }

    const token = getToken();

    // --- VERIFY INVITE ---
    async function verifyInvite(token) {
        try {
            const res = await fetch(
                `https://hflxahfkrzmiufhqagul.supabase.co/rest/v1/invites?token=eq.${token}&select=*`,
                {
                    headers: {
                        "apikey": "sb_publishable_QglNYbjZZzMQ7fckuYH-kA_QqBPuvmu",
                        "Authorization": "Bearer sb_publishable_QglNYbjZZzMQ7fckuYH-kA_QqBPuvmu"
                    }
                }
            );

            const data = await res.json();

            // ❌ no token found
            if (!data.length) return false;
return true;

            const invite = data[0];

            // ❌ already used
            if (invite.used) return false;

            // ❌ expired
if (Date.parse(invite.expires_at) <= Date.now()) return false;
            return true;

        } catch (err) {
            return false;
        }
    }

    // --- EXPIRED PAGE ---
    function showExpiredPage() {
        document.body.innerHTML = `
            <div style="
                display:flex;
                align-items:center;
                justify-content:center;
                height:100vh;
                font-family:Inter;
                background:#0f172a;
                color:white;
                flex-direction:column;
            ">
                <h1>❌ Expired Link</h1>
                <p>This invite is invalid or expired.</p>
            </div>
        `;
    }

    // --- PAGE LOAD CHECK ---
    (async () => {
        if (!token) {
            showExpiredPage();
            return;
        }

        const valid = await verifyInvite(token);

        if (!valid) {
            showExpiredPage();
        }
    })();

    // --- MARK TOKEN USED ---
    async function markAsUsed(token) {
    await fetch(
        "https://hflxahfkrzmiufhqagul.supabase.co/rest/v1/rpc/use_invite",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": "sb_publishable_QglNYbjZZzMQ7fckuYH-kA_QqBPuvmu",
                "Authorization": "Bearer sb_publishable_QglNYbjZZzMQ7fckuYH-kA_QqBPuvmu"
            },
            body: JSON.stringify({
                input_token: token
            })
        }
    );
}

    // --- SIGNUP ---
    async function signUp() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validation
        if (!email || !password) {
            showStatus("Please fill in all fields", "error");
            return;
        }

        if (password.length < 6) {
            showStatus("Password must be at least 6 characters", "error");
            return;
        }

        // UI loading
        btnText.innerText = "PROCESSING...";
        signUpBtn.style.opacity = "0.7";
        signUpBtn.disabled = true;

        try {
            const res = await fetch(
                "https://hflxahfkrzmiufhqagul.supabase.co/auth/v1/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": "sb_publishable_QglNYbjZZzMQ7fckuYH-kA_QqBPuvmu"
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        options: {
                            email_redirect_to:
                                "https://mltuna-supa.netlify.app/confirm.html"
                        }
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                showStatus(
                    data.error_description ||
                        data.message ||
                        "Signup failed",
                    "error"
                );
                btnText.innerText = "SIGN UP";
            } else {
                await markAsUsed(token);

                showStatus(
                    "Check your email for the verification link! ✨",
                    "success"
                );

                btnText.innerText = "DONE";
                emailInput.value = "";
                passwordInput.value = "";
            }
        } catch (err) {
            showStatus("Network error. Check your connection.", "error");
            btnText.innerText = "SIGN UP";
        } finally {
            signUpBtn.style.opacity = "1";
            signUpBtn.disabled = false;
        }
    }

    // --- STATUS HELPER ---
    function showStatus(text, type) {
        status.innerText = text;
        status.className = `status-message ${type}`;
    }

    // --- EVENT ---
    if (signUpBtn) {
        signUpBtn.addEventListener("click", (e) => {
            e.preventDefault();
            signUp();
        });
    }
});