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
        const body = await context.request.json().catch(() => ({}));
        const { pin } = body;

        if (!pin) {
            return new Response(JSON.stringify({ error: "Missing PIN" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        // Validate PIN
        const student = await db.prepare("SELECT pin FROM students WHERE id = ?").bind(id).first();
        if (!student) {
            return new Response(JSON.stringify({ error: "Student not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
        }
        if (student.pin !== pin) {
            return new Response(JSON.stringify({ error: "Incorrect PIN" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }

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

export async function onRequestPatch(context) {
    const db = context.env.DB;
    const id = context.params.id;

    if (!id) {
        return new Response(JSON.stringify({ error: "Missing ID" }), { 
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const body = await context.request.json();
        const { pin, milestone, isCompleted } = body;

        if (!pin || !milestone) {
            return new Response(JSON.stringify({ error: "Missing PIN or milestone" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        const validMilestones = ['bab1', 'bab2', 'bab3', 'propDefense', 'bab4', 'bab5', 'finalDefense'];
        if (!validMilestones.includes(milestone)) {
            return new Response(JSON.stringify({ error: "Invalid milestone" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        // Validate PIN
        const student = await db.prepare("SELECT pin FROM students WHERE id = ?").bind(id).first();
        if (!student) {
            return new Response(JSON.stringify({ error: "Student not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
        }
        if (student.pin !== pin) {
            return new Response(JSON.stringify({ error: "Incorrect PIN" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }

        const column = `${milestone}CompletedAt`;
        const timestamp = isCompleted ? new Date().toISOString() : null;

        await db.prepare(`UPDATE students SET ${column} = ? WHERE id = ?`)
            .bind(timestamp, id)
            .run();

        return new Response(JSON.stringify({ success: true, completedAt: timestamp }), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
