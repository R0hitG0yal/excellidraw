// import { type JSX } from "react";

import { ReactNode } from "react";

// export function Card({
//   className,
//   title,
//   children,
//   href,
// }: {
//   className?: string;
//   title: string;
//   children: React.ReactNode;
//   href: string;
// }): JSX.Element {
//   return (
//     <a
//       className={className}
//       href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo"`}
//       rel="noopener noreferrer"
//       target="_blank"
//     >
//       <h2>
//         {title} <span>-&gt;</span>
//       </h2>
//       <p>{children}</p>
//     </a>
//   );
// }

export function Card({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-100 hover:border-indigo-100 hover:shadow-lg transition-all">
      <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
