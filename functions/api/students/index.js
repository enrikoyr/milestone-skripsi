export async function onRequestGet(context) {
    const db = context.env.DB;

    try {
        const { results } = await db.prepare("SELECT id, name, nim, startDate, createdAt, bab1CompletedAt, bab2CompletedAt, bab3CompletedAt, propDefenseCompletedAt, bab4CompletedAt, bab5CompletedAt, finalDefenseCompletedAt FROM students ORDER BY createdAt ASC").all();
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
        const { name, nim, startDate, pin } = data;

        if (!name || !nim || !startDate || !pin) {
             return new Response(JSON.stringify({ error: "Name, nim, startDate, and pin are required" }), { 
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        await db.prepare("INSERT INTO students (id, name, nim, pin, startDate) VALUES (?, ?, ?, ?, ?)")
                .bind(id, name, nim, pin, startDate)
                .run();

        const newStudent = { id, name, nim, startDate, createdAt: new Date().toISOString() };

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
