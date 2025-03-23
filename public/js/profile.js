const token = localStorage.getItem("token");

const loadUser = async function () {
    try {
        const response = await fetch("/api/user", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.status === 401 || response.status === 403) {
            window.location.href = "./login.html";
            return;
        }
        const data = await response.json();
        if (response.ok) {
            document.getElementById("name").value = data.findUser.name;
            document.getElementById("email").value = data.findUser.email;
        } else {
            getElementById("message").innerText = data.message;
        }
    } catch (err) {
        console.log(err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadUser();
});

function goHome() {
    setTimeout(() => {

        window.location.href = './home.html';
    }, 0);
}

async function saveChanges(event) {
    event.preventDefault();
    if (confirm("save changes?")) {
        try {
            const name = document.getElementById("name").value;
            const newPassword = document.getElementById("newPassword").value;
            const response = await fetch("/api/user", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, newPassword })
            });

            if (response.status === 401 || response.status === 403) {
                window.location.href = "./login.html";
                return;
            }
            const data = await response.json();
            if (response.ok) {
                document.getElementById("message").style.color = "green";
            } else {
                document.getElementById("message").style.color = "red";
            }
            document.getElementById("message").innerText = data.message;
        } catch (err) {
            console.log("catch: " + err.message);
        }
    } else {
        console.log("else");
    }
}
