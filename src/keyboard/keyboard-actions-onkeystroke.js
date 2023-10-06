import { constants } from "../state";
import { concat, constructRowSpans, getRowById } from "../util";
import { handleInputWhileTextSelected } from "../util";

/**
 * @param {Event} e
 */
export function onKeystroke(e) {
  //e.key
  e.preventDefault();
  const isTab = e.key.toLowerCase() === constants.KEYSTROKES.TAB;
  let row = getRowById();
  const currentRowHTML = row.innerText;
  const k = isTab ? "   " : e.key;
  const { updatedRow, value } = handleInputWhileTextSelected({
    currentRowText: currentRowHTML,
    data: k,
    ignoreSubstringUpdate: e.key.includes(" "),
  });
  let newRowText =
    value ??
    concat(
      currentRowHTML.slice(0, activeSpanSubstringIdx),
      k,
      currentRowHTML.slice(activeSpanSubstringIdx)
    );
  activeSpanSubstringIdx += isTab
    ? constants.KEYSTROKES_COUNT.TAB
    : constants.KEYSTROKES_COUNT.DEFAULT;
  constructRowSpans(updatedRow || row, newRowText);
}
