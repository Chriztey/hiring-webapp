// interface Candidate {
//   id: string;
//   fullName: string;
//   email: string;
//   phoneNumber: string;
//   dateOfBirth: string;
//   domicile: string;
//   gender: string;
//   linkedinLink: string;
// }

// export default function CandidateTable({
//   candidates,
// }: {
//   candidates: Candidate[];
// }) {
//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full border-separate border-spacing-y-3">
//         <thead>
//           <tr className="bg-neutral-20 text-left text-s-bold text-neutral-100">
//             <th className="px-4 py-3">
//               <input
//                 type="checkbox"
//                 className="w-[20px] h-[20px] border border-primary-border accent-primary-main"
//               />
//             </th>
//             <th className="px-4 py-2">NAMA LENGKAP</th>
//             <th className="px-4 py-2">EMAIL ADDRESS</th>
//             <th className="px-4 py-2">PHONE NUMBER</th>
//             <th className="px-4 py-2">DATE OF BIRTH</th>
//             <th className="px-4 py-2">DOMICILE</th>
//             <th className="px-4 py-2">GENDER</th>
//             <th className="px-4 py-2">LINK LINKEDIN</th>
//           </tr>
//         </thead>

//         <tbody>
//           {candidates.map((c) => (
//             <tr
//               key={c.id}
//               className="border-t border-neutral-30 text-m-regular text-neutral-90 hover:bg-neutral-10 transition-colors"
//             >
//               <td className="px-4 py-2">
//                 <input
//                   type="checkbox"
//                   className="w-[20px] h-[20px] accent-primary-main border-primary-border border-8"
//                 />
//               </td>

//               <td className="px-4 py-2">{c.fullName || "-"}</td>
//               <td className="px-4 py-2 max-w-[200px] truncate">
//                 {c.email || "-"}
//               </td>
//               <td className="px-4 py-2">{c.phoneNumber || "-"}</td>
//               <td className="px-4 py-2">
//                 {c.dateOfBirth ? formatDate(c.dateOfBirth) : "-"}
//               </td>
//               <td className="px-4 py-2">{c.domicile || "-"}</td>
//               <td className="px-4 py-2">{c.gender || "-"}</td>

//               <td className="px-4 py-2 max-w-[200px] truncate">
//                 {c.linkedinLink ? (
//                   <a
//                     href={c.linkedinLink}
//                     className="text-primary-main hover:underline"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     {c.linkedinLink}
//                   </a>
//                 ) : (
//                   "-"
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// // helper to format date in DD MMM YYYY
// function formatDate(dateStr: string) {
//   const date = new Date(dateStr);
//   return date.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// }

"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  domicile: string;
  gender: string;
  linkedinLink: string;
}

interface CandidateTableProps {
  candidates: Candidate[];
}

export default function CandidateTable({ candidates }: CandidateTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>([
    "select",
    "fullName",
    "email",
    "phoneNumber",
    "dateOfBirth",
    "domicile",
    "gender",
    "linkedinLink",
  ]);

  const columns: ColumnDef<Candidate>[] = [
    {
      id: "select",
      header: "SEL",
      cell: ({ row }) => (
        <input
          className="w-5 h-5 accent-primary-main border-primary-border border-8"
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      size: 30,
    },
    {
      id: "fullName",
      accessorKey: "fullName",
      header: "NAMA LENGKAP",
      size: 100,
    },
    { id: "email", accessorKey: "email", header: "EMAIL ADDRESS", size: 200 },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: "SUBMITTED AT",
      size: 150,
      cell: ({ row }) => {
        const raw = row.getValue("created_at") as string;
        return raw ? formatTimestamp(raw) : "-";
      },
    },
    {
      id: "phoneNumber",
      accessorKey: "phoneNumber",
      header: "PHONE NUMBER",
      size: 150,
    },
    {
      id: "dateOfBirth",
      accessorKey: "dateOfBirth",
      header: "DATE OF BIRTH",
      size: 120,
    },
    { id: "domicile", accessorKey: "domicile", header: "DOMICILE", size: 150 },
    { id: "gender", accessorKey: "gender", header: "GENDER", size: 100 },
    {
      id: "linkedinLink",
      accessorKey: "linkedinLink",
      header: "LINK LINKEDIN",
      size: 200,
      cell: ({ row }) =>
        row.getValue("linkedinLink") ? (
          <a
            href={row.getValue("linkedinLink")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-main hover:underline"
          >
            {row.getValue("linkedinLink")}
          </a>
        ) : (
          "-"
        ),
    },
  ];

  const table = useReactTable({
    data: candidates,
    columns,
    state: { sorting, columnOrder },
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = columnOrder.indexOf(active.id as string);
      const newIndex = columnOrder.indexOf(over.id as string);
      setColumnOrder((columns) => arrayMove(columns, oldIndex, newIndex));
    }
  };

  const DraggableHeader = ({ header }: { header: any }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: header.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      minWidth: header.getSize(),
    };

    const sortIcon = header.column.getIsSorted()
      ? header.column.getIsSorted() === "asc"
        ? "▲"
        : "▼"
      : "⇅";

    return (
      <th ref={setNodeRef} style={style} className="px-4 py-2 select-none">
        <div className="flex items-center justify-between">
          {/* Drag handle */}
          <span {...attributes} {...listeners} className="mr-2 cursor-move">
            ☰
          </span>

          {/* Clickable header for sorting */}
          <span
            onClick={header.column.getToggleSortingHandler()}
            className="flex-1 cursor-pointer"
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
          </span>

          <span
            onClick={header.column.getToggleSortingHandler()}
            className="text-xs text-neutral-60 ml-1 cursor-pointer select-none"
          >
            {sortIcon}
          </span>
        </div>

        {/* Resize handle */}
        {header.column.getCanResize() && (
          <div
            onMouseDown={header.getResizeHandler()}
            className="inline-block w-1 h-full bg-neutral-40 cursor-col-resize"
          />
        )}
      </th>
    );
  };

  return (
    <div className="overflow-x-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <table className="min-w-full border-separate border-spacing-y-3 whitespace-nowrap">
          <thead className="bg-neutral-20 text-left text-s-bold text-neutral-100 ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-neutral-20 text-left text-s-bold text-neutral-100 "
              >
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers.map((header) => (
                    <DraggableHeader key={header.id} header={header} />
                  ))}
                </SortableContext>
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-neutral-30 text-m-regular text-neutral-90 hover:bg-neutral-10 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 max-w-fit  whitespace-nowrap overflow-hidden"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </DndContext>
    </div>
  );
}

// Helper to format date
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTimestamp(timestamp: string) {
  // Convert to proper ISO string for Date
  const date = new Date(timestamp.replace(" ", "T"));

  // Format as "DD MMM YYYY, HH:mm"
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
