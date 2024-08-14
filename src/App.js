import { useState } from "react";

function SearchBar({
  filterText,
  inStockOnly,
  isSortAsc,
  onFilterTextChange,
  onInStockOnlyChange,
  onIsSortAscChange,
}) {
  return (
    <form>
      <input
        value={filterText}
        onChange={(e) => onFilterTextChange(e.target.value)}
        type="text"
        placeholder="Search..."
      />
      <label>
        <input
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
          type="checkbox"
        />
        Only show products in stock
      </label>
      <label>
        <input
          checked={isSortAsc}
          onChange={(e) => onIsSortAscChange(e.target.checked)}
          type="checkbox"
        />
        Sort ascending by price
      </label>
    </form>
  );
}
function ProductTable({ products, filterText, inStockOnly, isSortAsc }) {
  const rows = [];
  let lastcategory = null;
  let localProducts = products;

  if (isSortAsc) {
    localProducts = products
      .map((item) => {
        return {
          ...item,
          price: +item.price.replace("$", ""),
        };
      })
      .sort((a, b) => a.price - b.price)
      .map((item) => {
        return {
          ...item,
          price: `$${item.price}`,
        };
      });
  }

  localProducts.forEach((product, index) => {
    if (product.name.indexOf(filterText) === -1) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastcategory) {
      rows.push(
        <ProductCategoryRow
          key={index + product.category}
          category={product.category}
        />
      );
    }
    rows.push(<ProductRow key={product.name} product={product} />);
    lastcategory = product.category;
  });
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  );
}
function ProductRow({ product }) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span className="text-red">{product.name}</span>
  );
  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}
function FilterbleProductTable({ products }) {
  const [filterText, setFilterText] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isSortAsc, setIsSortAsc] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        isSortAsc={isSortAsc}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
        onIsSortAscChange={setIsSortAsc}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
        isSortAsc={isSortAsc}
      />
    </div>
  );
}

const PRODUCTS = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
];

export default function App() {
  return <FilterbleProductTable products={PRODUCTS} />;
}
