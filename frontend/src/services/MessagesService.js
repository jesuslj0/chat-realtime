export async function fetchMessages(room) {
    const token = localStorage.getItem("jwt_token");

    try {
        const response = await fetch(`http://localhost:4001/api/chat/${room}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Success fetching messages: ", data.messages);
        return data.messages || []; 
    } catch (err) {
        console.error("Error fetching messages: ", err);
        return [];
    }
}

export async function saveMessage(message) {
    const token = localStorage.getItem("jwt_token");

    try {
        const response = await fetch("http://localhost:4001/api/chat/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(message)
        })

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = response.json()
        console.log("Mensaje guardado", data.content)
        return data || ""
    
    } catch (err) {
        console.error("Error al guardar el mensaje: ", err)
        return ""
    }
    
}
