// src/app/page.tsx
import type { ShopifyExtension, ShopifyProduct } from "@/types";
import { gql } from "../utils/gql";
import { formatPrice } from "../utils/formatPrice";
import Image from "next/image";
import Link from "next/link";

type GraphQLResponse = {
  data: {
    products: {
      nodes: ShopifyProduct[];
    };
  };
  extensions: ShopifyExtension;
};
const getProducts = async (): Promise<GraphQLResponse> => {
  const res = await fetch(process.env.GRAPHQL_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESSTOKEN!
    },
    body: JSON.stringify({
      query: gql`
      query ProductsQuery {
        products(first: 7) {
          nodes {
            description
            featuredImage {
              altText
              height
              id
              url
              width
            }
            handle
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            tags
            title
          }
        }
      }
      `
    })
  });

  if (!res.ok) {
    const text = await res.text(); // get the response body for more information

    throw new Error(`
      Failed to fetch data
      Status: ${res.status}
      Response: ${text}
    `);
  }

  return res.json();
};
const HomePage = async () => {
  const json = await getProducts();
  return (
   <>
   <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {json.data.products.nodes.map((product) => (
          //const prodId = product.id.split("/").pop();
            <Link key={product.id} href={product.handle} className="group">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText}
                width={product.featuredImage.width}
                height={product.featuredImage.height}
                className="h-full w-full object-cover object-center group-hover:opacity-75"
                blurDataURL={product.featuredImage.url}
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{product.title}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{product.priceRangeV2.minVariantPrice.currencyCode} {formatPrice(product.priceRangeV2.minVariantPrice.amount)}{" "}
                </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
   </>
  );
};

export default HomePage;