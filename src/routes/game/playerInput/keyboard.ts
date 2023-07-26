export const keyboard = new Set<string>();

addEventListener("keydown", (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    keyboard.add(key);
});

addEventListener("keyup", (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    keyboard.delete(key);
});
