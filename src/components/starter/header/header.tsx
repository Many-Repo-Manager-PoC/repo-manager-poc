import { component$ } from "@builder.io/qwik";
import styles from "./header.module.css";
import { KunaiLogo } from "../icons/kunai";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <header class={styles.header}>
      <div class={["container", styles.wrapper]}>
        <Link
          href="https://www.kunaico.com/"
          class="bg-[#324060] rounded-full p-4 shadow-[0_4px_8px_0_rgba(0,0,0,0.25)] hover:-translate-y-1 hover:scale-105"
          style="display: flex; flex-direction: row; align-items: center; gap: 0.5rem;"
        >
          <div class={styles.logo}>
            <KunaiLogo />
          </div>
          <h2>Kunai</h2>
        </Link>
      </div>
    </header>
  );
});
