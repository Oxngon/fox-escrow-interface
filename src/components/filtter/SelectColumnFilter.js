export default function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  setFilter(e.target.value || undefined);
}
