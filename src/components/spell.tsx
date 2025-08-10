import c from "classnames";
import { useEffect, useMemo, useState } from "react";
import upcastIcon from "src/assets/icons/other/upcast.png";

import type { Spell } from "src/models/spell";
import { SpellTooltipContent } from "./spell-tooltip";
import { Tooltip } from "./tooltip";

import styles from "./spell.module.css";

export function Spell({
  spell,
  highlighted,
  detailed,
}: {
  spell: Spell;
  highlighted: boolean | undefined;
  detailed: boolean | undefined;
}) {
  const [selected, setSelected] = useState(false);

  const [showImage, setShowImage] = useState(false);
  const randomDuration = useMemo(() => (Math.random() + 0.5).toFixed(2), []);
  const randomDelay = useMemo(() => (Math.random() * 2 + 1).toFixed(2), []);

  const animatedSpellStyles = {
    "--randomDelay": randomDelay + "s",
    "--randomDuration": randomDuration + "s",
  } as React.CSSProperties;

  useEffect(
    function setShowImageWhenTransitionEnds() {
      if (detailed) {
        const transitionTime =
          (parseFloat(randomDuration) + parseFloat(randomDelay)) * 1000;

        const timer = setTimeout(() => {
          setShowImage(true);
        }, transitionTime);

        return () => {
          clearTimeout(timer);
          setShowImage(false);
        };
      } else {
        setShowImage(false);
      }
    },
    [detailed, randomDuration, randomDelay]
  );

  const onClick = () => {
    if (!detailed) {
      return;
    }
    setSelected(!selected);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!detailed) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelected(!selected);
    }
  };

  return (
    <article
      className={c(
        styles.spell,
        highlighted && !detailed && styles.highlighted,
        detailed && styles.detailed,
        detailed && selected && styles.selected,
      )}
      data-spell-id={spell.id}
      style={animatedSpellStyles}
      aria-label={spell.name}
      aria-expanded={detailed ? "true" : "false"}
      {...(detailed ? { 
        onClick, 
        onKeyDown,
        tabIndex: 0,
        role: "button",
        "aria-pressed": selected ? "true" : "false"
      } : {})}
    >
      {detailed && showImage ? (
        <Tooltip 
          content={
            <SpellTooltipContent 
              spell={spell} 
              requiresConcentration={spell.concentration}
            />
          }
        >
          <div className={styles.image}>
            <img src={spell.icon} alt={spell.name} className={styles.icon} />
            {spell.upcast && (
              <img src={upcastIcon} alt="upcast" className={styles.upcast} />
            )}
          </div>
        </Tooltip>
      ) : null}
    </article>
  );
}
