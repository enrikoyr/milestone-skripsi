export async function onRequestDelete(context) {
    const db = context.env.DB;
    const id = context.params.id; // Grab the ID from the URL path ([id].js)

    if (!id) {
        return new Response(JSON.stringify({ error: "Missing ID" }), { 
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        await db.prepare("DELETE FROM students WHERE id = ?").bind(id).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
