import { Hono } from 'hono';
import { renderer } from './renderer';
import type { Note } from './types';

const app = new Hono();

app.use(renderer);

// Initialize in-memory store
let notes: Note[] = [];
let nextId = 1;

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>);
});

// GET /notes (List Notes)
app.get('/notes', (c) => {
  return c.json(notes);
});

// POST /notes (Create Note)
app.post('/notes', async (c) => {
  const { title, content } = await c.req.json<{
    title: string;
    content: string;
  }>();
  if (!title || !content) {
    return c.json({ error: 'Title and content are required' }, 400);
  }
  const now = new Date().toISOString();
  const newNote: Note = {
    id: (nextId++).toString(),
    title,
    content,
    createdAt: now,
    updatedAt: now,
  };
  notes.push(newNote);
  return c.json(newNote, 201); // 201 Created status
});

// GET /notes/:id (Get Note by ID)
app.get('/notes/:id', (c) => {
  const id = c.req.param('id');
  const note = notes.find((n) => n.id === id);
  if (!note) {
    return c.json({ error: 'Note not found' }, 404);
  }
  return c.json(note);
});

// PUT /notes/:id (Update Note)
app.put('/notes/:id', async (c) => {
  const id = c.req.param('id');
  const noteIndex = notes.findIndex((n) => n.id === id);
  if (noteIndex === -1) {
    return c.json({ error: 'Note not found' }, 404);
  }

  const { title, content } = await c.req.json<{
    title?: string;
    content?: string;
  }>();
  const now = new Date().toISOString();

  // Update only provided fields
  const originalNote = notes[noteIndex];
  notes[noteIndex] = {
    ...originalNote,
    title: title ?? originalNote.title, // Use ?? nullish coalescing
    content: content ?? originalNote.content,
    updatedAt: now,
  };

  return c.json(notes[noteIndex]);
});

// DELETE /notes/:id (Delete Note)
app.delete('/notes/:id', (c) => {
  const id = c.req.param('id');
  const initialLength = notes.length;
  notes = notes.filter((n) => n.id !== id);

  if (notes.length === initialLength) {
    return c.json({ error: 'Note not found' }, 404);
  }

  return c.json({ message: 'Note deleted successfully' }, 200); // Or return c.body(null, 204) for No Content
});

export default app;
