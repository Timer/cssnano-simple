const postcss = require('postcss');
const mod = require('../..');
const css = require('../noop-template');

describe('accepts plugin configuration', () => {
  test('should not remove all comments', async () => {
    const input = css`
      p {
        /*! heading */
        color: yellow;
      }
    `;

    const res = await postcss([mod({ discardComments: {} })]).process(input, {
      from: 'input.css',
      to: 'output.css',
    });

    expect(res.css).not.toBe('p{color:#ff0}');
  });

  test('should remove all comments', async () => {
    const input = css`
      p {
        /*! heading */
        color: yellow;
      }
    `;

    const res = await postcss([
      mod({ discardComments: { removeAll: true } }),
    ]).process(input, {
      from: 'input.css',
      to: 'output.css',
    });

    expect(res.css).toBe('p{color:#ff0}');
  });
});
