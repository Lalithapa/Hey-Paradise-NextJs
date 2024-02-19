"use client"
import { addToCart } from '@/utils/shopify';

type props = {
  prodId: string;
}
const ATC = ({prodId} : props) => {
    return (
       <>
       <p>{prodId}</p>
        <button
            className="border border-blue-600 inline-block p-2 rounded-md text-blue-600 hover:bg-blue-600 hover:text-white ease-in-out duration-150"
            type="button"
            onClick={() => addToCart(prodId, 1)}
        >
            Add to Cart
        </button>
       </>
    );
};

export default ATC;
