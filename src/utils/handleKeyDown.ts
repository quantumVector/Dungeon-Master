export const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
        case 'w':
            window.scrollBy(0, -50);
            break;
        case 's':
            window.scrollBy(0, 50);
            break;
        case 'a':
            window.scrollBy(-50, 0);
            break;
        case 'd':
            window.scrollBy(50, 0);
            break;
        default:
            break;
    }
};
