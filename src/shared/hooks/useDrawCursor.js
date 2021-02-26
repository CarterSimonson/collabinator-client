import { useMemo} from "react";
import useStore from "store";

const cursorSVG = (size) => {
    return `"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'%3E%3Ccircle cx='${size/2}' cy='${size/2}' r='${size/2-2}' stroke='black' stroke-width='2' fill='none'/%3E%3C/svg%3E"`
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