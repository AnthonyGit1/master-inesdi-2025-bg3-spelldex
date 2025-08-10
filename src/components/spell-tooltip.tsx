import upcastIcon from "src/assets/icons/other/upcast.png";
import type { Spell } from "src/models/spell";
import styles from "./spell-tooltip.module.css";

// Mapeo de tipos de daño a colores e iconos simples
const damageTypeConfig = {
  "Acid": { color: "#8fbc8f", symbol: "🧪" },
  "Cold": { color: "#87ceeb", symbol: "❄️" },
  "Fire": { color: "#ff6347", symbol: "🔥" },
  "Force": { color: "#dda0dd", symbol: "✨" },
  "Lightning": { color: "#1e90ff", symbol: "⚡" },
  "Necrotic": { color: "#8b008b", symbol: "💀" },
  "Piercing": { color: "#c0c0c0", symbol: "🗡️" },
  "Poison": { color: "#9acd32", symbol: "☠️" },
  "Psychic": { color: "#ff69b4", symbol: "🧠" },
  "Radiant": { color: "#ffd700", symbol: "☀️" },
  "Thunder": { color: "#696969", symbol: "🌩️" },
} as const;

type DamageType = keyof typeof damageTypeConfig;

export type SpellTooltipContentProps = {
  spell: Spell;
  requiresConcentration?: boolean;
};

export function SpellTooltipContent({ 
  spell, 
  requiresConcentration = false 
}: SpellTooltipContentProps) {
  const damageTypes = (spell.damage || [])
    .map(d => d.damageType as DamageType)
    .filter(type => type in damageTypeConfig);

  return (
    <div className={styles.content}>
      <h4 className={styles.name}>{spell.name}</h4>
      
      {spell.level > 0 && (
        <div className={styles.level}>
          Nivel {spell.level}
        </div>
      )}
      
      <div className={styles.icons}>
        {requiresConcentration && (
          <div className={styles.iconItem} title="Requiere concentración">
            <span className={styles.concentrationIcon}>🧘</span>
            <span className={styles.iconLabel}>Concentración</span>
          </div>
        )}
        
        {spell.upcast && (
          <div className={styles.iconItem} title="Hechizo de aumento">
            <img 
              src={upcastIcon} 
              alt="Aumento" 
              className={styles.upcastIcon}
            />
            <span className={styles.iconLabel}>Aumento</span>
          </div>
        )}
      </div>

      {damageTypes.length > 0 && (
        <div className={styles.damageTypes}>
          <span className={styles.damageLabel}>Tipos de daño:</span>
          <div className={styles.damageIcons}>
            {damageTypes.map((type, index) => {
              const config = damageTypeConfig[type];
              return (
                <div 
                  key={index}
                  className={styles.damageIcon}
                  style={{ color: config.color }}
                  title={type}
                >
                  <span className={styles.damageSymbol}>{config.symbol}</span>
                  <span className={styles.damageTypeName}>{type}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
