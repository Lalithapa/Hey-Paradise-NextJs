const storefrontAccessToken = process.env.STOREFRONTACCESSTOKEN;
const endpoint = process.env.SHOPURL;
import { gql, GraphQLClient } from "graphql-request";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    "Content-Type": "application/json",
  },
});

export async function getProducts() {
  const getAllProductsQuery = gql`
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
              }
            }
            featuredImage {
              altText
              url
            }
          }
        }
      }
    }
  `;
  try {
    return await graphQLClient.request(getAllProductsQuery);
  } catch (error) {
    throw new Error(error);
  }
}
// Define GraphQL mutation to add a product to the cart
const addToCartMutation = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!) {
    checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: [{ quantity: $quantity, variantId: $productId }]) {
      checkout {
        id
        lineItems(first: 10) {
          edges {
            node {
              id
              title
              quantity
              variant {
                id
                price
              }
            }
          }
        }
      }
    }
  }
`;

// Function to add a product to the cart
export async function addToCart(productId, quantity) {
  try {
    // Send the mutation request to add the product to the cart
    const data = await graphQLClient.request(addToCartMutation, {
      productId,
      quantity: parseInt(quantity),
    });

    // Return the updated cart details
    return data.checkoutLineItemsAdd.checkout;
  } catch (error) {
    // Handle any errors that occur during the mutation request
    console.error('Error adding product to cart:', error);
    throw new Error('Failed to add product to cart');
  }
} 

export async function updateCart(cartId, itemId, quantity) {
  const updateCartMutation = gql`
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
        }
      }
    }
  `;
  const variables = {
    cartId: cartId,
    lines: [
      {
        quantity: parseInt(quantity),
        merchandiseId: itemId,
      },
    ],
  };

  try {
    const data = await graphQLClient.request(updateCartMutation, variables);
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function retrieveCart(cartId) {
  const cartQuery = gql`
    query cartQuery($cartId: ID!) {
      cart(id: $cartId) {
        id
        createdAt
        updatedAt
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  product {
                    id
                    title
                    handle
                    featuredImage {
                      url
                      altText
                    }
                    priceRange {
                      minVariantPrice {
                        amount
                      }
                    }
                  }
                }
              }
            }
          }
        }

        estimatedCost {
          totalAmount {
            amount
          }
        }
      }
    }
  `;
  const variables = {
    cartId,
  };
  try {
    const data = await graphQLClient.request(cartQuery, variables);
    return data.cart;
  } catch (error) {
    throw new Error(error);
  }
}

export const getProduct = async (id) => {
  const productQuery = gql`
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        handle
        title
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
        }
        variants(first: 10) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `;
  const variables = {
    id,
  };
  try {
    const data = await graphQLClient.request(productQuery, variables);
    return data.product;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCheckoutUrl = async (cartId) => {
  const getCheckoutUrlQuery = gql`
    query checkoutURL($cartId: ID!) {
      cart(id: $cartId) {
        checkoutUrl
      }
    }
  `;
  const variables = {
    cartId: cartId,
  };

  try {
    return await graphQLClient.request(getCheckoutUrlQuery, variables);
  } catch (error) {
    throw new Error(error);
  }
};