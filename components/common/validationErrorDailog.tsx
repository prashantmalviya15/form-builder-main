"use client";

import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  errors: Record<string, any>;
};

export default function ValidationErrorDialog({
  open,
  onClose,
  errors,
}: Props) {
  if (!open) return null;

  const errorList = Object.values(errors);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border">
        {/* Header */}
        <div className="flex items-center bg-slate-900 rounded-t-xl text-white justify-between border-b p-4">
          <h2 className="text-lg font-semibold ">
            Validation Errors
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-4 max-h-80 overflow-y-auto">
          {errorList.length === 0 ? (
            <p className="text-sm text-gray-500">
              No validation errors
            </p>
          ) : (
            <ul className="space-y-2">
              {errorList.map((err: any, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>{err?.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-4 py-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
          >
            Fix Errors
          </button>
        </div>
      </div>
    </div>
  );
}