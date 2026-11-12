"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import {
  Button,
  CheckboxButton,
  CheckboxField,
  CheckboxGroup,
  Form,
  Label,
  Text,
} from "react-aria-components";
import {
  type PokemonFilters as Filters,
  GENERATION_OPTIONS,
  getPokemonFilterHref,
  parsePokemonFilters,
  TYPE_OPTIONS,
} from "@/lib/pokemon-filters";
import { usePokemonOverview } from "./pokemon-overview-provider";

export default function PokemonFilters({
  initialFilters,
}: {
  initialFilters: Filters;
}) {
  const router = useRouter();
  const { saveSnapshot } = usePokemonOverview();
  const [generations, setGenerations] = useState(
    initialFilters.generations.map(String),
  );
  const [types, setTypes] = useState<string[]>(initialFilters.types);
  const [isPending, startTransition] = useTransition();

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    generations.forEach((value) => params.append("generation", value));
    types.forEach((value) => params.append("type", value));
    const filters = parsePokemonFilters(params);

    // Applying a selection always starts at the first page of its results.
    saveSnapshot(null);
    startTransition(() => router.push(getPokemonFilterHref(filters)));
  }

  return (
    <div className="pokemon-filters flex h-full min-h-0 flex-col">
      <div className="pokedex-index-header shrink-0">
        <h1 className="text-xl">Filter</h1>
      </div>
      <p className="pokemon-filter-intro">
        Choose one or more options. Leave a group empty to include all.
      </p>
      <Form
        action="/"
        method="get"
        onSubmit={applyFilters}
        className="pokemon-filter-form"
      >
        <div className="pokemon-filter-options">
          <CheckboxGroup
            name="generation"
            value={generations}
            onChange={setGenerations}
            isDisabled={isPending}
            className="pokemon-filter-group"
          >
            <Label className="pokemon-filter-label">Generation</Label>
            <Text slot="description" className="pokemon-filter-description">
              Match any selected introduction generation.
            </Text>
            <div className="pokemon-filter-generation-options">
              {GENERATION_OPTIONS.map(({ id, label }) => (
                <FilterCheckbox
                  key={id}
                  value={String(id)}
                  label={label}
                  compactLabel={label.replace("Generation", "Gen")}
                />
              ))}
            </div>
          </CheckboxGroup>
          <CheckboxGroup
            name="type"
            value={types}
            onChange={setTypes}
            isDisabled={isPending}
            className="pokemon-filter-group"
          >
            <Label className="pokemon-filter-label">Type</Label>
            <Text slot="description" className="pokemon-filter-description">
              Match any selected type. Both groups apply together.
            </Text>
            <div className="pokemon-filter-type-options">
              {TYPE_OPTIONS.map(({ value, name }) => (
                <FilterCheckbox key={value} value={value} label={name} />
              ))}
            </div>
          </CheckboxGroup>
        </div>
        <div className="pokemon-filter-actions">
          <Link
            href={getPokemonFilterHref(initialFilters)}
            className="pokedex-filter-button"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            isDisabled={isPending}
            className="pokedex-filter-button pokemon-filter-apply"
          >
            {isPending ? "Applying filters…" : "Apply filters"}
          </Button>
        </div>
        <p role="status" className="pokemon-filter-status">
          {isPending ? "Loading matching Pokémon…" : ""}
        </p>
      </Form>
    </div>
  );
}

function FilterCheckbox({
  value,
  label,
  compactLabel,
}: {
  value: string;
  label: string;
  compactLabel?: string;
}) {
  return (
    <CheckboxField value={value} className="pokemon-filter-checkbox">
      <CheckboxButton className="pokemon-filter-checkbox-button">
        <span className="pokemon-filter-indicator" aria-hidden="true">
          <Check size={14} className="pokemon-filter-check" />
        </span>
        {compactLabel ? (
          <>
            <span aria-hidden="true">{compactLabel}</span>
            <span className="sr-only">{label}</span>
          </>
        ) : (
          <span>{label}</span>
        )}
      </CheckboxButton>
    </CheckboxField>
  );
}
