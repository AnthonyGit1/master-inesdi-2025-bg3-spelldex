import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ClassGrid } from "src/components/class-grid";
import { SpellDiagram } from "src/components/spell-diagram";

import type { ClassId } from "src/models/character-class";

import styles from "./class-detail.module.css";

export function ClassDetailPage() {
  const { classId } = useParams<{ classId: string }>();
  const [highlightedClass, setHighlightedClass] = useState<ClassId>();
  const navigate = useNavigate();

  // Validar que classId sea una clase válida
  useEffect(() => {
    if (classId && !["bard", "cleric", "druid", "sorcerer", "warlock", "wizard"].includes(classId)) {
      navigate("/");
    }
  }, [classId, navigate]);

  const selectedClass = classId as ClassId | undefined;

  // Manejar navegación con teclado globalmente
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "Escape" || event.key === "Backspace") && selectedClass) {
        event.preventDefault();
        setHighlightedClass(undefined);
        navigate("/");
      }
    };

    // Agregar event listener global
    document.addEventListener("keydown", handleKeyDown);
    
    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedClass, navigate]);

  const handleClassClick = () => {
    // En el comportamiento original, hacer click en la clase seleccionada no hace nada
    // Mantenemos este comportamiento para preservar la funcionalidad exacta
    return;
  };

  return (
    <>
      <SpellDiagram
        highlightedClass={highlightedClass}
        selectedClass={selectedClass}
        background={false}
      />

      <main className={styles.main}>
        <ClassGrid
          selectedClass={selectedClass}
          background={true}
          highlight={setHighlightedClass}
          onClick={handleClassClick}
        />
      </main>
    </>
  );
}
