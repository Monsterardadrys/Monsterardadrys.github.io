/* =========================================================================
   nutrition-data.js — per 100g figures, GENERATED, do not hand-edit

   Rebuild with:  node tools/build-nutrition.js <export-file>

   Source: Livsmedelsverket's food database, matched food by food through
   tools/lmv-aliases.json — the same confirmed matches the audit uses. A
   food appears here only if its match was confirmed by hand.

   Empty until the generator has been run against an export. Every page
   reading this must cope with a food that is simply missing, because around
   a quarter of the database has no Livsmedelsverket entry at all.
   ========================================================================= */

const NUTRITION = {};
