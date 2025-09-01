import type { ReactNode } from "react";

interface TableWrapperProps {
  headers: string[];
  children: ReactNode;
  emptyMessage?: string;
}

export default function TableWrapper({
  headers,
  children,
  emptyMessage = "Tidak ada data",
}: TableWrapperProps) {
  const isEmpty =
    !children || (Array.isArray(children) && children.length === 0);

  return (
    <div className="overflow-x-auto mb-4">
      <table className="table table-zebra w-full">
        <thead className="bg-base-200">
          <tr>
            {headers.map((h, idx) => (
              <th key={idx} className="px-3 py-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-3 py-4 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}
