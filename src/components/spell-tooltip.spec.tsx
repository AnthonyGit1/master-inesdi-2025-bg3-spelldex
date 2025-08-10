import { render, screen } from "@testing-library/react";
import { SpellTooltipContent } from "./spell-tooltip";
import type { Spell } from "src/models/spell";

const mockSpell: Spell = {
  id: "fireball",
  url: "https://example.com",
  name: "Fireball",
  icon: "fireball.png",
  level: 3,
  upcast: true,
  action: "Action",
  duration: "Instantaneous",
  range: "150 ft",
  type: "DEX save",
  damage: [
    {
      dice: "8d6",
      damageType: "Fire"
    }
  ],
  concentration: false
};

const mockConcentrationSpell: Spell = {
  ...mockSpell,
  id: "hex",
  name: "Hex",
  level: 1,
  concentration: true,
  upcast: false,
  damage: [
    {
      dice: "1d6",
      damageType: "Necrotic"
    }
  ]
};

describe("SpellTooltipContent", () => {
  it("renders spell name", () => {
    render(<SpellTooltipContent spell={mockSpell} />);
    
    expect(screen.getByText("Fireball")).toBeInTheDocument();
  });

  it("shows level for leveled spells", () => {
    render(<SpellTooltipContent spell={mockSpell} />);
    
    expect(screen.getByText("Nivel 3")).toBeInTheDocument();
  });

  it("shows upcast icon when spell can be upcast", () => {
    render(<SpellTooltipContent spell={mockSpell} />);
    
    expect(screen.getByText("Aumento")).toBeInTheDocument();
  });

  it("shows concentration icon when requiresConcentration is true", () => {
    render(<SpellTooltipContent spell={mockConcentrationSpell} requiresConcentration={true} />);
    
    expect(screen.getByText("Concentración")).toBeInTheDocument();
  });

  it("shows damage types when spell has damage", () => {
    render(<SpellTooltipContent spell={mockSpell} />);
    
    expect(screen.getByText("Tipos de daño:")).toBeInTheDocument();
    expect(screen.getByText("Fire")).toBeInTheDocument();
  });

  it("handles spells with no damage gracefully", () => {
    const spellWithoutDamage: Spell = {
      ...mockSpell,
      damage: []
    };
    
    render(<SpellTooltipContent spell={spellWithoutDamage} />);
    
    expect(screen.queryByText("Tipos de daño:")).not.toBeInTheDocument();
  });

  it("handles spells with multiple damage types", () => {
    const multiDamageSpell: Spell = {
      ...mockSpell,
      damage: [
        { dice: "2d6", damageType: "Fire" },
        { dice: "1d4", damageType: "Cold" }
      ]
    };
    
    render(<SpellTooltipContent spell={multiDamageSpell} />);
    
    expect(screen.getByText("Fire")).toBeInTheDocument();
    expect(screen.getByText("Cold")).toBeInTheDocument();
  });
});
