module.exports = () => {
  return `
    <div class="Form">
      <form action="/" method="POST">
        <div class="Form-CommitHash">
          <label class="Form-Label" for="Form-CommitHash">Commit hash</label>
          <input class="Form-Input" id="Form-CommitHash" name="commitHash" />
        </div>

        <div class="Form-Command">
          <label class="Form-Label" for="Form-Command">Build command</label>
          <input class="Form-Input" id="Form-Command" name="buildCommand" />
        </div>

        <div class="Form-SubmitWrapper">
          <button type="submit">Run build</button>
        </div>
      </form>
    </div>
  `;
}