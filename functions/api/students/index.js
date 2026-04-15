export async function onRequestGet(context) {
    const db = context.env.DB;

    try {
        const { results } = await db.prepare("SELECT id, name, proposalDate, createdAt, bab3CompletedAt, bab4CompletedAt, bab5CompletedAt FROM students ORDER BY createdAt ASC").all();
        return new Response(JSON.stringify(results), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function onRequestPost(context) {
    const db = context.env.DB;

    try {
        const data = await context.request.json();
        
        // Generate an ID if one isn't provided
        const id = data.id || crypto.randomUUID();
        const { name, proposalDate, pin } = data;

        if (!name || !proposalDate || !pin) {
             return new Response(JSON.stringify({ error: "Name, proposalDate, and pin are required" }), { 
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        await db.prepare("INSERT INTO students (id, name, pin, proposalDate) VALUES (?, ?, ?, ?)")
                .bind(id, name, pin, proposalDate)
                .run();

        const newStudent = { id, name, proposalDate, createdAt: new Date().toISOString() };

        return new Response(JSON.stringify(newStudent), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
