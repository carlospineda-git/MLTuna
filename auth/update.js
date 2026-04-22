/* --- ML TUNA PASSWORD UPDATE SCRIPT --- */

document.addEventListener('DOMContentLoaded', () => {
    const updateBtn = document.getElementById('updateBtn');
    const passwordInput = document.getElementById('newPassword');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const status = document.getElementById('status');
    const btnText = document.querySelector(".btn-text");

    // --- 1. Password Strength Checker ---
    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        let strength = 0;

        if (val.length >= 6) strength += 25;
        if (val.match(/[0-9]/)) strength += 25;
        if (val.match(/[A-Z]/)) strength += 25;
        if (val.match(/[^a-zA-Z0-9]/)) strength += 25;

        strengthBar.style.width = strength + "%";
        
        if (strength <= 25) {
            strengthBar.style.background = "#ef4444";
            strengthText.innerText = "Strength: Weak";
        } else if (strength <= 75) {
            strengthBar.style.background = "#f59e0b";
            strengthText.innerText = "Strength: Decent";
        } else {
            strengthBar.style.background = "#10b981";
            strengthText.innerText = "Strength: Strong";
        }
    });

    // --- 2. Supabase Update Logic ---
    async function updatePassword() {
        const password = passwordInput.value;

        if (!password) {
            showStatus("Please enter a password", "error");
            return;
        }

        // UI Loading
        btnText.innerText = "UPDATING...";
        updateBtn.disabled = true;

        try {
            const res = await fetch(
                "https://hflxahfkrzmiufhqagul.supabase.co/auth/v1/user",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": "sb_publishable_QglNYbjZZzMQ7fckuYH-kA_QqBPuvmu",
                        "Authorization": "Bearer " + localStorage.getItem("access_token")
                    },
                    body: JSON.stringify({ password: password })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                showStatus(data.error_description || "Update failed. Session might be expired.", "error");
                btnText.innerText = "SAVE CHANGES";
            } else {
                showStatus("Password updated successfully! 🎉", "success");
                btnText.innerText = "UPDATED";
                passwordInput.value = "";
                strengthBar.style.width = "0%";
            }
        } catch (err) {
            showStatus("Network error. Try again later.", "error");
            btnText.innerText = "SAVE CHANGES";
        } finally {
            updateBtn.disabled = false;
        }
    }

    function showStatus(text, type) {
        status.innerText = text;
        status.className = `status-message ${type}`;
    }

    updateBtn.addEventListener('click', updatePassword);
});
