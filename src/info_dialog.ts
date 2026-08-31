/**
  * UI elements related to info dialog
  */
export interface InfoFields {
  /**
    * Element which opens up info dialog
    */
  openInfoButton: HTMLElement
  /**
    * Parent to render dialog in
    */
  dialogContainer: HTMLElement
}

/**
  * Places info dialog in the passed dialog container and connects it up to the passed button
  * When the button is pressed, dialog will be displayed
  *
  * @param fields UI fields for connecting the info dialog
  */
export function setupInfoDialog(
  fields: InfoFields
) {
  renderDialog(fields.dialogContainer);

  const dialog = fields.dialogContainer.querySelector<HTMLDialogElement>('#infoDialog')!;
  dialog.addEventListener("click", (_event: Event) => {
    dialog.close();
  });
  const dialogArea = fields.dialogContainer.querySelector<HTMLDivElement>('#infoDialogArea')!;
  dialogArea.addEventListener("click", (event: Event) => {
    event?.stopPropagation();
  });
  dialog.close();

  fields.openInfoButton.addEventListener("click", (_event: Event) => {
    dialog.showModal();
  });
}

const INFO_DIALOG_CONTENTS = import.meta.env.VITE_APP_INFO_DIALOG_CONTENTS || `
<h2>Quad9 Newly Observed Domains</h2>
<p>
This is a realtime sample stream of some of the newly observed domains that are seen on the Quad9 array of DNS servers. The full set is significantly larger. Note that a domain appearing here does not mean it has just been registered (though that is often the case.) This simply means this is the first time it has been seen on the Quad9 platform. A "domain" is a portion of a name that appears in the ICANN section of the Public Suffix List (PSL.) 
<p>
Questions? Send to <a href="mailto:jtodd@quad9.net">jtodd@quad9.net</a>
</p>
`;

function renderDialog(dialogContainer: HTMLElement) {
  dialogContainer.innerHTML = `
    <dialog id="infoDialog" class="dialog-container">
      <div id="infoDialogArea" style="max-width: 800px; text-align: start;">
        ${INFO_DIALOG_CONTENTS}
      </div>
    </dialog>
  `;
}
