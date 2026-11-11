import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ScreenLoader } from "@/components/screen-loader";

export default function Loading() {
  return (
    <div className="pokemon-detail pokemon-detail-loading">
      <div className="pokemon-detail-header">
        <ScreenLoader message="Loading Pokémon entry…" />
        <Link href="/" className="pokemon-detail-back">
          <ArrowLeft size={14} aria-hidden="true" />
          All Pokémon
        </Link>
      </div>

      <div aria-hidden="true">
        <div className="pokemon-detail-record">
          <div className="pokemon-detail-specimen">
            <span className="pokemon-detail-loading-artwork" />
          </div>
          <div className="pokemon-detail-identity">
            <span className="pokemon-detail-loading-bar pokemon-detail-loading-title" />
            <span className="pokemon-detail-loading-bar pokemon-detail-loading-category" />
            <div className="pokemon-detail-types">
              <span className="pokemon-detail-loading-bar pokemon-detail-loading-type" />
              <span className="pokemon-detail-loading-bar pokemon-detail-loading-type" />
            </div>
            <div className="pokemon-detail-facts">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index}>
                  <span className="pokemon-detail-loading-bar w-1/3" />
                  <span className="pokemon-detail-loading-bar w-1/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pokemon-detail-identification">
          <span className="pokemon-detail-footprint-stamp" />
          <span className="pokemon-detail-loading-bar pokemon-detail-loading-cry" />
        </div>
        <div className="pokemon-detail-description pokemon-detail-loading-description">
          <span className="pokemon-detail-loading-bar w-1/4" />
          <span className="pokemon-detail-loading-bar" />
          <span className="pokemon-detail-loading-bar w-3/4" />
        </div>
      </div>
    </div>
  );
}
