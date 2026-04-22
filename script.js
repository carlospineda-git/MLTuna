/* --- ML TUNA AUTH SCRIPT --- */

document.addEventListener("DOMContentLoaded", () => {
    const signUpBtn = document.getElementById("signUpBtn");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const status = document.getElementById("status");
    const btnText = document.querySelector(".btn-text");

    // --- TOKEN ---
    function getToken() {
        const params = new URLSearchParams(window.location.search);
        return params.get("token");
    }

    const token = getToken();

    // --- VERIFY INVITE ---
    
    
    async function verifyInvite(token) {
    const res = await fetch(
        `https://hflxahfkrzmiufhqagul.supabase.co/rest/v1/invites?token=eq.${token}&expires_at=gt.now()&used=eq.false&select=*`,
        {
            headers: {
                apikey: "sb_publishable_QglNYbjZZzMQ7fckuYH-kA_QqBPuvmu",
                Authorization: "Bearer sb_publishable_QglNYbjZZzMQ7fckuYH-kA_QqBPuvmu"
            }
        }
    );

    const data = await res.json();
    return data.length > 0;
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

    // --- SUCCESS PAGE ---
    function showSuccessPage() {
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
                <h1>✅ Account Created</h1>
                <p>Check your email to verify your account.</p>
            </div>
        `;
    }

    // --- PAGE CHECK ---
    (async () => {
        if (!token) return showExpiredPage();

        const valid = await verifyInvite(token);

        if (!valid) showExpiredPage();
    })();

    // --- MARK USED ---
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
                body: JSON.stringify({ input_token: token })
            }
        );
    }

function sendInviteEmail(email) {
    const inviteLink = `https://carlospineda-git.github.io/MLTuna/confirm.html?token=${token}`;

try {
    emailjs.send(
        "service_a2hpgys",
        "template_6vlvl8m",
        {
            email: email,
            invite_link: inviteLink
        },
        "fZ4GIJG7hr3XHbPq6"
    );
        console.log("Verification email sent!");
    } catch (err) {
        console.error("Email failed:", err);
    }
}


    // --- SIGNUP ---
    async function signUp() {

        // 🔒 prevent spam click
        if (signUpBtn.disabled) return;

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showStatus("Please fill in all fields", "error");
            return;
        }

        if (password.length < 6) {
            showStatus("Password must be at least 6 characters", "error");
            return;
        }

        btnText.innerText = "PROCESSING...";
        signUpBtn.style.opacity = "0.7";
        signUpBtn.disabled = true;

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
                    })
                }
            );
            
            async function insert(email) {
            const res1 = await fetch(
		'https://hflxahfkrzmiufhqagul.supabase.co/rest/v1/user_devices', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"apikey": "sb_publishable_QglNYbjZZzMQ7fckuYH-kA_QqBPuvmu",
				"Authorization": "Bearer sb_publishable_QglNYbjZZzMQ7fckuYH-kA_QqBPuvmu",
				"Prefer": "return=minimal"
			},
			body: JSON.stringify({
				email: email,
				device_id: null
			})
		}
	);
	}

            const data = await res.json();

            if (!res.ok) {
                showStatus(
                    data.error_description ||
                    data.message ||
                    "Signup failed",
                    "error"
                );

                btnText.innerText = "SIGN UP";
                signUpBtn.disabled = false; // allow retry
                return;
            } else {

            // ✅ SUCCESS

            await markAsUsed(token);
            await sendInviteEmail(email);
            await insert(email);
            showSuccessPage();
        }
    }

    // --- STATUS ---
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