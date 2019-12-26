export class BaseCliClass {
  protected _res: null | (() => void) = null;
  public async res() {
    return new Promise(res => {
      this._res = res;
    });
  }
}
