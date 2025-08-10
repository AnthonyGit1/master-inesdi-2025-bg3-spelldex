import c from "classnames";
import { useRef, useEffect } from "react";
import spellsByClass from "src/data/spells-by-class.json";
import spells from "src/data/spells.json";
import { Spell } from "./spell";

import type { ClassId, SellsByClass } from "src/models/character-class";
import type { SpellId } from "src/models/spell";
import type { Spell as SpellType } from "src/models/spell";
import styles from "./spell-diagram.module.css";

type Props = {
  selectedClass: ClassId | undefined;
  highlightedClass: ClassId | undefined;
  background?: boolean;
};

export function SpellDiagram({
  highlightedClass,
  selectedClass,
  background,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spellsByLevel = groupSpellsByLevel(spells as SpellType[]);
  const status = selectedClass
    ? "selected"
    : highlightedClass
    ? "highlighted"
    : "none";

  const currentClass = selectedClass || highlightedClass;
  const highlightedSpells = currentClass
    ? new Set((spellsByClass as SellsByClass)[currentClass])
    : new Set<SpellId>();

  const isSpellHighlighted = (spell: SpellType) =>
    highlightedClass && highlightedSpells.has(spell.id);

  const isSpellDetailed = (spell: SpellType) =>
    selectedClass && highlightedSpells.has(spell.id);

  // Función para obtener todos los hechizos interactivos (detallados)
  const getInteractiveSpells = () => {
    if (!selectedClass) return [];
    
    const container = containerRef.current;
    if (!container) return [];

    const spellElements = container.querySelectorAll('[data-spell-id][tabindex="0"]');
    return Array.from(spellElements) as HTMLElement[];
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!selectedClass) return;

    const interactiveSpells = getInteractiveSpells();
    if (interactiveSpells.length === 0) return;

    const currentFocusedIndex = interactiveSpells.findIndex(
      (spell) => spell === document.activeElement
    );

    if (currentFocusedIndex === -1) return;

    let nextIndex = currentFocusedIndex;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (currentFocusedIndex + 1) % interactiveSpells.length;
        event.preventDefault();
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = currentFocusedIndex === 0 
          ? interactiveSpells.length - 1 
          : currentFocusedIndex - 1;
        event.preventDefault();
        break;
      case "Tab":
        if (!event.shiftKey) {
          nextIndex = (currentFocusedIndex + 1) % interactiveSpells.length;
        } else {
          nextIndex = currentFocusedIndex === 0 
            ? interactiveSpells.length - 1 
            : currentFocusedIndex - 1;
        }
        event.preventDefault();
        break;
    }

    if (nextIndex !== currentFocusedIndex) {
      interactiveSpells[nextIndex]?.focus();
    }
  };

  // Enfocar el primer hechizo interactivo cuando se selecciona una clase
  useEffect(() => {
    if (selectedClass && status === "selected") {
      const timer = setTimeout(() => {
        const container = containerRef.current;
        if (!container) return;

        const spellElements = container.querySelectorAll('[data-spell-id][tabindex="0"]');
        const interactiveSpells = Array.from(spellElements) as HTMLElement[];
        
        if (interactiveSpells.length > 0) {
          interactiveSpells[0].focus();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [selectedClass, status]);

  return (
    <div
      ref={containerRef}
      className={c(
        styles.spellDiagram,
        background && styles.background,
        status === "selected" && styles.selected,
        status === "highlighted" && styles.highlighted
      )}
      onKeyDown={onKeyDown}
    >
      {Array.from({ length: 7 }, (_, level) => {
        const { firstHalf, secondHalf } = twoRows(spellsByLevel[level]);

        return (
          <div key={level} className={styles.levelGroup} data-level={level}>
            <div className={styles.row}>
              {firstHalf.map((spell, idx) => (
                <Spell
                  key={`${level}-1-${idx}`}
                  spell={spell}
                  highlighted={isSpellHighlighted(spell)}
                  detailed={isSpellDetailed(spell)}
                />
              ))}
            </div>
            <div className={styles.row}>
              {secondHalf.map((spell, idx) => (
                <Spell
                  key={`${level}-2-${idx}`}
                  spell={spell}
                  highlighted={isSpellHighlighted(spell)}
                  detailed={isSpellDetailed(spell)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function twoRows(spells: SpellType[] = []) {
  const half = Math.ceil(spells.length / 2);
  return {
    firstHalf: spells.slice(0, half),
    secondHalf: spells.slice(half),
  };
}

function groupSpellsByLevel(spells: SpellType[]) {
  return spells.reduce<Record<number, SpellType[]>>((acc, spell) => {
    if (!acc[spell.level]) {
      acc[spell.level] = [];
    }
    acc[spell.level].push(spell);
    return acc;
  }, {});
}
