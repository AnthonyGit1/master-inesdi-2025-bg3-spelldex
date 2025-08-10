import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClassGrid } from "src/components/class-grid";
import { SpellDiagram } from "src/components/spell-diagram";

import type { ClassId } from "src/models/character-class";

import styles from "./home.module.css";

export function HomePage() {
  const [highlightedClass, setHighlightedClass] = useState<ClassId>();
  const navigate = useNavigate();

  const handleClassClick = (classId: ClassId | undefined) => {
    if (classId) {
      navigate(`/${classId}`);
    }
  };

  return (
    <>
      <SpellDiagram
        highlightedClass={highlightedClass}
        selectedClass={undefined}
        background={true}
      />

      <main className={styles.main}>
        <ClassGrid
          selectedClass={undefined}
          background={false}
          highlight={setHighlightedClass}
          onClick={handleClassClick}
        />
      </main>
    </>
  );
}
