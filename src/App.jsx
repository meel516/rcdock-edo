import DockLayout from 'rc-dock';
import 'rc-dock/dist/rc-dock.css';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { produce } from 'immer';
import rdiff from 'recursive-diff';
import Sql from '../Sql';
import Er from '../Er';
import ChartPreviewComponent from './ChartPreviewComponent';
import { refContext } from '../refContext';

export default function App() {
  const regex2 = /subpath\d+/;
  const regex1 = /mainpath\d+/;
  const regex3 = /sidepath\d+/;

  const CustomNavigate = (location, regex, path) => {
    let loc = location;
    loc = regex.test(loc) ? loc.replace(regex, path) : loc + '/' + path;
    navigate(loc);
  };

  const [location, navigate] = useLocation();
  const mainref = useContext(refContext);

  const [match, param] = useRoute('*?/*?/mainpath1/*?/*?');
  const [match2, param2] = useRoute('*?/*?/mainpath2/*?/*?');
  const [match3, param3] = useRoute('*?/*?/subpath1/*?/*?');
  const [match4, param4] = useRoute('*?/*?/subpath2/*?/*?');
  const [match5, param5] = useRoute('*?/*?/sidepath1/*?/*?');
  const [match6, param6] = useRoute('*?/*?/sidepath2/*?/*?');

  const components = useMemo(
    () => ({
      Tab1: React.memo(() => <div>chartvisualizer</div>),
      Tab2: React.memo(() => <div>add to workflow</div>),
      Tab3: React.memo(() => <Er />),
      Tab4: React.memo(() => <Sql />),
      Tab5: React.memo(() => <div>sql helper</div>),
      Tab6: React.memo(() => <ChartPreviewComponent />),
    }),
    []
  );

  const getTabContent = (match, Component) => (match ? <Component /> : null);

  const defaultLayout = useMemo(
    () => ({
      dockbox: {
        mode: 'vertical',
        children: [
          {
            tabs: [
              {
                id: 'tab1',
                title: (
                  <span
                    onClick={() => CustomNavigate(location, regex2, 'subpath1')}
                  >
                    tab1
                  </span>
                ),
                content: getTabContent(match3, components.Tab1),
              },
              {
                id: 'tab2',
                title: (
                  <span
                    onClick={() => CustomNavigate(location, regex2, 'subpath2')}
                  >
                    tab2
                  </span>
                ),
                content: getTabContent(match4, components.Tab2),
              },
            ],
            activeId: match3 ? 'tab1' : match4 ? 'tab2' : null,
          },
          {
            mode: 'horizontal',
            children: [
              {
                tabs: [
                  {
                    id: 'tab3',
                    title: (
                      <span
                        onClick={() =>
                          CustomNavigate(location, regex1, 'mainpath1')
                        }
                      >
                        tab1
                      </span>
                    ),
                    content: getTabContent(match, components.Tab3),
                  },
                  {
                    id: 'tab4',
                    title: (
                      <span
                        onClick={() =>
                          CustomNavigate(location, regex1, 'mainpath2')
                        }
                      >
                        tab2
                      </span>
                    ),
                    content: getTabContent(match2, components.Tab4),
                  },
                ],
                activeId: match ? 'tab3' : match2 ? 'tab4' : null,
              },
              {
                tabs: [
                  {
                    id: 'tab5',
                    title: (
                      <span
                        onClick={() =>
                          CustomNavigate(location, regex3, 'sidepath1')
                        }
                      >
                        tab1
                      </span>
                    ),
                    content: getTabContent(match5, components.Tab5),
                  },
                  {
                    id: 'tab6',
                    title: (
                      <span
                        onClick={() =>
                          CustomNavigate(location, regex3, 'sidepath2')
                        }
                      >
                        tab2
                      </span>
                    ),
                    content: getTabContent(match6, components.Tab6),
                  },
                ],
                activeId: match5 ? 'tab5' : match6 ? 'tab6' : null,
              },
            ],
          },
        ],
      },
    }),
    [match, match2, match3, match4, match5, match6, location, components]
  );

  const [conlayout, setconlayout] = useState(defaultLayout);

  useEffect(() => {
    setconlayout(defaultLayout);
  }, [defaultLayout]);

  const loadTab = (data) => {
    let { id, content, title } = data;
    return {
      id,
      title,
      content,
      maximizable: true,
      cached: true,
    };
  };

  return (
    <DockLayout
      ref={mainref}
      layout={conlayout}
      loadTab={loadTab}
      onLayoutChange={(newLayout, currentTabId, direction) => {
        console.log(newLayout, conlayout, currentTabId, direction);
        if (mainref.current && direction === 'maximize' && !conlayout.maxbox) {
          setconlayout((prev) => ({
            ...prev,
            maxbox: {
              children: [
                {
                  tabs: [mainref.current.find(currentTabId)],
                },
              ],
            },
          }));
        } else {
          let diff = rdiff.getDiff(conlayout.dockbox, newLayout.dockbox);
          let riff = diff.filter(
            (e) =>
              (e.op === 'add' || e.op === 'update') && e.path.includes('size')
          );
          let lil = produce(conlayout.dockbox, (draft) => {
            for (let i = 0; i < riff.length; i++) {
              setDynamicPath(draft, riff[i].path, riff[i].val);
            }
          });
          console.log(lil == conlayout.dockbox, 'badboy');
          setconlayout({ dockbox: lil });
        }
      }}
      style={{
        position: 'absolute',
        left: 10,
        top: 10,
        right: 10,
        bottom: 10,
      }}
    />
  );
}

function setDynamicPath(draft, path, value) {
  let current = draft;
  for (let i = 0; i < path.length - 1; i++) {
    if (typeof current[path[i]] === 'undefined') {
      current[path[i]] = {};
    }
    current = current[path[i]];
  }
  current[path[path.length - 1]] = value;
}
