import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { RootState } from "./redux";
import { decrement, increment } from "./redux/sliceState/counterSlice";

export default function App() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <div>
      <div>
        <button aria-label="Increment value" onClick={() => dispatch(increment())}>
          Increment
        </button>
        <span>{count}</span>
        <button aria-label="Decrement value" onClick={() => dispatch(decrement())}>
          Decrement
        </button>
      </div>
    </div>
  );
}
