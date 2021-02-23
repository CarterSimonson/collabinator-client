import { useMemo} from "react";
import useStore from "store";

const cursorSVG = (size) => {
    return `"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 24 24'%3E%3Cpath d='M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z'/%3E%3C/svg%3E"`;
}

const useDrawCursor = () => {
    const size = useStore(state => state.size);

    const cursorStyle = useMemo(() => {
        const offset = size / 2;
        return `url(${cursorSVG(size)}) ${offset} ${offset}, auto`;
    }, [size]);

    return [cursorStyle];
}

export default useDrawCursor;