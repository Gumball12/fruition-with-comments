import { reactive } from '@vue/reactivity';

interface UserDataKeys {
  [key: string]: string;
}

export interface UserDatas extends UserDataKeys {
  repo: string;
  'repo-id': string;
  category: string;
  'category-id': string;
  'reactions-enabled': string;
  'emit-metadata': string;
  theme: string;
}

export const userDatas = reactive<UserDatas>({
  repo: '',
  'repo-id': '',
  category: '',
  'category-id': '',
  'reactions-enabled': '',
  'emit-metadata': '',
  theme: '',
});

export const isValidScriptElem = ({
  userDatas,
  scriptElem,
}: {
  userDatas: UserDatas;
  scriptElem: Element | null;
}) => {
  if (!scriptElem) {
    return false;
  }

  const datasetAttributes = Object.keys(userDatas);

  return ![
    ['src', 'https://giscus.app/client.js', false],
    ...datasetAttributes.map(key => [`data-${key}`, '', true]),
    ['data-mapping', 'url', false],
    ['crossorigin', 'anonymous', false],
  ].some(
    ([key, value, expect]) =>
      !scriptElem.hasAttribute(key as string) ||
      (scriptElem.getAttribute(key as string) === value) === expect,
  );
};

export const updateUserDatasFromScriptElem = ({
  scriptElem,
  userDatas,
}: {
  scriptElem: Element;
  userDatas: UserDatas;
}) =>
  Object.keys(userDatas).forEach(
    key =>
      (userDatas[key as keyof UserDataKeys] =
        scriptElem.getAttribute(`data-${key}`) ?? ''),
  );

export const genWorkerScriptFromUserDatas = (userDatas: UserDatas) => {
  const script = `<script type="module">
const commentsConfigs = {
  target: 'giscus',
  repo: '${userDatas.repo}',
  mapping: 'url',

  repoId: '${userDatas['repo-id']}',
  category: '${userDatas.category}',
  categoryId: '${userDatas['category-id']}',
  term: '',
  reactions: ${userDatas['reactions-enabled'] === '1' ? 'true' : 'false'},
  metadata: ${userDatas['emit-metadata'] === '1' ? 'true' : 'false'},
  theme: '${userDatas.theme}',
};

const genScriptElement = () => {
  const el = document.createElement('script');

  const {
    repoId,
    category,
    categoryId,
    term,
    reactions,
    metadata,
    theme,
  } = commentsConfigs;

  const configs = {
    src: 'https://giscus.app/client.js',
    crossorigin: 'anonymous',
    async: true,
    'data-repo': commentsConfigs.repo,
    'data-repo-id': repoId,
    'data-category': category,
    'data-category-id': categoryId,
    'data-term': term,
    'data-mapping': commentsConfigs.mapping,
    'data-reactions-enabled': (reactions ? 1 : 0),
    'data-emit-metadata': (metadata ? 1 : 0),
    'data-theme': theme,
  };

  for (const [key, value] of Object.entries(configs)) {
    el.setAttribute(key, value);
  }

  return el;
};

new MutationObserver(([mutation], observer) => {
  if (mutation.addedNodes.length === 0) {
    return;
  }

  const appendTargetLastChild = document.querySelector('div.notion-presence-container');

  if (!appendTargetLastChild) {
    return;
  }

  const appendTarget = appendTargetLastChild.parentElement;

  if (appendTarget.dataset.comments) {
    return;
  }

  appendTarget.dataset.comments = true;
  appendTarget.insertBefore(genScriptElement(), appendTargetLastChild);
}).observe(document.querySelector('div#notion-app'), {
  subtree: true,
  childList: true,
});
  </script>`;

  const style = `<style>
  .notion-page-content {
    padding-bottom: 5vh !important;
  }
  .giscus {
    width: 900px;
    max-width: 100%;
    padding-left: calc(96px + env(safe-area-inset-left));
    padding-right: calc(96px + env(safe-area-inset-right));
    padding-bottom: 5vh;
  }
  </style>`;

  return [script, style].join('\n');
};
