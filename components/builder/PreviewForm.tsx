/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useBuilderStore } from "@/lib/builder/store";
import type { Block } from "@/lib/builder/types";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

function flattenBlocks(
  schema: ReturnType<typeof useBuilderStore.getState>["schema"],
): Block[] {
  const blocks: Block[] = [];
  for (const s of schema.sections) {
    for (const r of s.rows) {
      for (const c of r.columns) {
        blocks.push(...c.blocks);
      }
    }
  }
  return blocks;
}

export default function PreviewForm() {
  const schema = useBuilderStore((s) => s.schema);
  const blocks = useMemo(() => flattenBlocks(schema), [schema]);
  const [submitted, setSubmitted] = useState<any>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null); 

  const { register, handleSubmit } = useForm();

  console.log("schema", schema);
  console.log("schema", schema);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-3">
        <div className="text-lg font-semibold">{schema.name} (Preview)</div>
        <div className="text-xs text-slate-500">Submit to see JSON output</div>
      </div>
       <form
        className="space-y-3 rounded-xl border bg-white p-4"
        onSubmit={handleSubmit((data) => setSubmitted(data))}
      >
        {schema.sections.map((section) => (
  <div
    key={section.id}
    className="space-y-4 border rounded-xl p-4 py-6 bg-white"
  >
    {/* Optional Section Title */}
    {/* {section.title && (
      <h2 className="text-lg font-semibold text-slate-800">
        {section.title}
      </h2>
    )} */}

    {section.rows.map((row) => {
      const colCount = row.columns.length;

      return (
        <div
          key={row.id}
          className={`grid gap-4 ${
            colCount === 1
              ? "grid-cols-1"
              : colCount === 2
              ? "grid-cols-2"
              : "grid-cols-3"
          }`}
        >
          {row.columns.map((column) => (
            <div key={column.id} className="w-full">
              {column.blocks.map((b) => (
                <div key={b.id} className="w-full">
                  {/* STATIC BLOCKS */}
                  {b.type === "divider" && <hr className="my-2" />}

                  {b.type === "heading" && (
                    <h3 className="text-lg font-semibold">{b.text}</h3>
                  )}

                  {b.type === "paragraph" && (
                    <p className="text-sm text-slate-600">{b.text}</p>
                  )}

                  {b.type === "headerAndDescription" && (
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold">{b.text}</h3>
                      {b.description && (
                        <p className="text-sm text-slate-600">
                          {b.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* FIELD BLOCKS */}
                  {b.type === "checkbox" && (
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        {...register(b.name, {
                          required: !!b.required,
                        })}
                      />
                      {b.label}
                    </label>
                  )}

                  {b.type === "select" && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium">
                        {b.label}
                      </label>
                      <select
                        className="w-full rounded-lg border p-2 text-sm"
                        {...register(b.name, {
                          required: !!b.required,
                        })}
                      >
                        <option value="">
                          {b.placeholder ?? "Select..."}
                        </option>
                        {(b.options ?? []).map((o) => (
                          <option key={o.id} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {b.type === "textarea" && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium">
                        {b.label}
                      </label>
                      <textarea
                        className="w-full rounded-lg border p-2 text-sm"
                        rows={4}
                        placeholder={b.placeholder ?? ""}
                        {...register(b.name, {
                          required: !!b.required,
                        })}
                      />
                    </div>
                  )}
                  {b.type === "image" && (
                    <div>
                  <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100">
                    <label className="text-sm font-semibold text-gray-800">
                     {b.text}
                    </label>
                    <input
                      className="mt-2 block w-full text-sm "
                      type="file"
                      accept="image/*"
                      {...register("photo")}
                      // onChange={(e) => {
                      //   const file = e.target.files?.[0];
                      //   if (file) setPhotoPreview(URL.createObjectURL(file));
                      //   else setPhotoPreview(null);
                      //   // react-hook-form register already handles value
                      // }}
                    />
                    {/* <p className="mt-2 text-xs text-gray-600">
                    (PDF में फोटो चिपकाने/संलग्न करने का निर्देश है)
                  </p> */}
                  </div>

                  <div className="rounded-xl bg-white p-4 ring-1 ring-gray-100">
                    <div className="text-sm font-medium text-gray-800">
                      Preview
                    </div>
                    <div className="mt-3 flex h-40 items-center justify-center overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-100">
                      {photoPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photoPreview}
                          alt="photo preview"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-sm text-gray-500">No image</span>
                      )}
                    </div>
                  </div>
                </div>
                  )}

                  {(b.type === "text" ||
                    b.type === "email" ||
                    b.type === "number" ||
                    b.type === "date") && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium">
                        {b.label}
                      </label>
                      <input
                        className="w-full rounded-lg border p-2 text-sm"
                        type={
                          b.type === "number"
                            ? "number"
                            : b.type === "email"
                            ? "email"
                            : b.type === "date"
                            ? "date"
                            : "text"
                        }
                        placeholder={b.placeholder ?? ""}
                        {...register(b.name, {
                          required: !!b.required,
                        })}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    })}
  </div>
))}
    {/* {schema.sections.map((section) => (
  <div key={section.id} className="space-y-2">
    {section.rows.map((row) => {
      const colCount = row.columns.length;

      return (
        <div
          key={row.id}
          className={`grid gap-4 ${
            colCount === 1
              ? "grid-cols-1"
              : colCount === 2
              ? "grid-cols-2"
              : "grid-cols-3"
          }`}
        >
          
        </div>
      );
    })}
  </div>
))} */}

     
        {/* {blocks.map((b) => (
          <div key={b.id} className={``}>
            
          </div>
        ))} */}
        {/* {blocks.map((b) => {
          if (b.type === "divider") return <hr key={b.id} className="my-2" />;

          if (b.type === "heading")
            return (
              <h3 key={b.id} className="text-lg font-semibold">
                {b.text}
              </h3>
            );
          if (b.type === "paragraph")
            return (
              <p key={b.id} className="text-sm text-slate-600">
                {b.text}
              </p>
            );
          if (b.type === "headerAndDescription") {
            return (
              <div key={b.id} className="space-y-1">
                <h3 className="text-xl font-semibold">{b.text}</h3>

                {b.description && (
                  <p className="text-sm text-slate-600">{b.description}</p>
                )}
              </div>
            );
          }

          // fields
          const field = b as any;
          const required = !!field.required;

          if (b.type === "checkbox") {
            return (
              <label key={b.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  {...register(field.name, { required })}
                />
                {field.label}
              </label>
            );
          }

          if (b.type === "select") {
            return (
              <div key={b.id} className="space-y-1">
                <label className="text-sm font-medium">{field.label}</label>
                <select
                  className="w-full rounded-lg border p-2 text-sm"
                  {...register(field.name, { required })}
                >
                  <option value="">{field.placeholder ?? "Select..."}</option>
                  {(field.options ?? []).map((o: any) => (
                    <option key={o.id} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (b.type === "radio") {
            return (
              <div key={b.id} className="space-y-1">
                <div className="text-sm font-medium">{field.label}</div>
                <div className="space-y-1">
                  {(field.options ?? []).map((o: any) => (
                    <label
                      key={o.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="radio"
                        value={o.value}
                        {...register(field.name, { required })}
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
              </div>
            );
          }

          const inputType =
            b.type === "number"
              ? "number"
              : b.type === "email"
                ? "email"
                : b.type === "date"
                  ? "date"
                  : "text";

          if (b.type === "textarea") {
            return (
              <div key={b.id} className="space-y-1">
                <label className="text-sm font-medium">{field.label}</label>
                <textarea
                  className="w-full rounded-lg border p-2 text-sm"
                  rows={4}
                  placeholder={field.placeholder ?? ""}
                  {...register(field.name, { required })}
                />
              </div>
            );
          }

          return (
            <div key={b.id} className="space-y-1">
              <label className="text-sm font-medium">{field.label}</label>
              <input
                className="w-full rounded-lg border p-2 text-sm"
                type={inputType}
                placeholder={field.placeholder ?? ""}
                {...register(field.name, { required })}
              />
            </div>
          );
        })} */}

        <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800">
          Submit
        </button>
      </form>

      {submitted ? (
        <div className="mt-4 rounded-xl border bg-white p-4">
          <div className="text-sm font-semibold">Submitted JSON</div>
          <pre className="mt-2 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-white">
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
