import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { LinkObject, NodeObject } from 'react-force-graph-2d';
import Graph from './graph/Graph';
import Records from './table/Records';
import Record from './data-classes/Record';
import RecordDialog from './dialogs/RecordDialog';
import {
  createRecord,
  editRecord,
  fetchCrawls,
  fetchLinks,
  fetchRecords,
  fetchTags,
} from './data-service';
import CrawledWeb from './data-classes/CrawledWeb';
import { ToggleSwitch } from './lib/ToggleSwitch';
import toast, { Toaster } from 'react-hot-toast';
import './css/CreateDialog.css';
import './css/App.css';

export default function App() {
  const [records, setRecords] = useState<Record[]>([]);
  const [activeRecordIds, setActiveRecordIds] = useState<number[]>([]);
  const [allCrawls, setAllCrawls] = useState<CrawledWeb[]>([]);
  const [allLinks, setAllLinks] = useState<LinkObject[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [change, setChange] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [domainView, setDomainView] = useState<boolean>(false);
  const [liveMode, setLiveMode] = useState<boolean>(false);
  const liveIntervalMs = 5000;

  useEffect(() => {
    const fetchAll = async () => {
      const [recordsData, linksData, tagsData, crawlsData] = await Promise.all([
        fetchRecords(),
        fetchLinks(),
        fetchTags(),
        fetchCrawls(),
      ]);
      setRecords(recordsData);
      setAllLinks(linksData);
      setTags(tagsData);
      setAllCrawls(crawlsData);
    };
    fetchAll();
    let interval: number | null = null;

    if (liveMode) {
      interval = window.setInterval(fetchAll, liveIntervalMs);
    }

    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [change, liveMode, activeRecordIds]);

  const getExecutionIds = useCallback(
    (record_ids: number[]): number[] => {
      const activeRecords: Record[] = records.filter((record) => record_ids.includes(record.id));
      return activeRecords.map((record) => record.crawledData?.executionId);
    },
    [records]
  );

  function hasIdProperty(node: unknown): node is { id: number | string } {
    return typeof node === 'object' && node !== null && 'id' in node;
  }

  const getNodeId = useCallback((node: string | number | NodeObject | undefined): number => {
    if (!node) throw new Error('Invalid node format');
    if (typeof node === 'number') return node;
    if (typeof node === 'string') return parseInt(node, 10);
    if (hasIdProperty(node)) return typeof node.id === 'string' ? parseInt(node.id, 10) : node.id;
    throw new Error('Invalid node format');
  }, []);
  const filterLinksByExecutionIds = useCallback(
    (links: LinkObject[], execution_ids: number[]): LinkObject[] => {
      return links.filter((link) => {
        if (link.source && link.target) {
          const crawlSource = allCrawls.find((crawl) => crawl.id === getNodeId(link.source));

          return crawlSource && execution_ids.includes(crawlSource.executionId);
        }
      });
    },
    [allCrawls, getNodeId]
  );
  const processNodes = useCallback(() => {
    if (allCrawls.length === 0) return { processedNodes: [], webToDomain: {} };
    const activeRecordExecs = getExecutionIds(activeRecordIds);
    const activeCrawls = filterCrawlsByExecutionIds(allCrawls, activeRecordExecs);
    if (!domainView) {
      return {
        processedNodes: activeCrawls.map((crawl) => ({
          id: crawl.id,
          label:
            crawl.state != crawl.title ? crawl.title.substring(0, 20) : crawl.url.substring(0, 20),
          title: crawl.state != crawl.title ? crawl.title : null,
          url: crawl.url,
          executionId: crawl.executionId,
          color: 'darkgreen',
          state: crawl.state,
          crawlTime: crawl.crawlTime,
        })),
        webToDomain: {},
      };
    }
    const domains: string[] = [];
    const domainRegex: RegExp = /:\/\/([^\/?#]+)/;
    const domainNodes: { [key: string]: NodeObject } = {}; // nodes by their domain

    const webToDomain: { [key: number]: string } = {};

    activeCrawls.forEach((crawl) => {
      const match = crawl.url.match(domainRegex);
      if (!match) return; // not a valid url
      const domain = match[1];

      if (!domains.includes(domain)) {
        const baseNode: NodeObject = {
          id: domain,
          label: domain,
          url: domain,
          urls: [],
          executionId: crawl.executionId,
          color: 'darkgreen',
          state: crawl.state,
          crawlTime: crawl.crawlTime,
        };

        domains.push(domain);
        domainNodes[domain] = baseNode;
      }
      domainNodes[domain].urls.push(crawl.url);

      webToDomain[crawl.id as number] = domain;
    });
    return { processedNodes: Object.values(domainNodes), webToDomain: webToDomain };
  }, [activeRecordIds, allCrawls, domainView, getExecutionIds]);

  const processLinks = useCallback(
    (webToDomain: { [key: number]: string }) => {
      const activeRecordExecs = getExecutionIds(activeRecordIds);

      if (!domainView) {
        const filteredLinks = filterLinksByExecutionIds(allLinks, activeRecordExecs);
        return filteredLinks.filter((link) => link.source && link.target);
      }

      const loadedLinks = allLinks.filter(
        (link) => webToDomain[link.source as number] && webToDomain[link.target as number]
      );

      const finalLinks = filterLinksByExecutionIds(loadedLinks, activeRecordExecs).map<LinkObject>(
        (link) => ({
          source: webToDomain[link.source as number],
          target: webToDomain[link.target as number],
        })
      );

      return finalLinks;
    },
    [activeRecordIds, allLinks, domainView, filterLinksByExecutionIds, getExecutionIds]
  );

  type NodesDomainMapping = {
    processedNodes: NodeObject[];
    webToDomain: { [key: number]: string };
  };
  const { processedNodes, processedLinks } = useMemo(() => {
    const nodesResult: NodesDomainMapping = processNodes();
    const linksResult = processLinks(nodesResult.webToDomain);
    return { processedNodes: nodesResult.processedNodes, processedLinks: linksResult };
  }, [processLinks, processNodes]);

  const handleViewChange = (value: boolean) => {
    setDomainView(value);
    setChange((prevState) => !prevState);
  };
  const handleLiveModeChange = (value: boolean) => {
    setLiveMode(value);
  };

  function filterCrawlsByExecutionIds(crawls: CrawledWeb[], execution_ids: number[]): NodeObject[] {
    return crawls.filter((crawl) => execution_ids.includes(crawl.executionId));
  }

  async function onCreateSubmit(event: FormEvent) {
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    try {
      const createPromise = createRecord(formData);
      toast.promise(createPromise, {
        loading: 'Loading...',
        success: 'Record created!',
      });
      const addedRecord = await createPromise;

      setLiveMode(true);
      setRecords((prev) => [...prev, addedRecord]);
      setActiveRecordIds((prev) => [...prev, addedRecord.id]);
    } catch (error) {
      console.log(error);
      toast.error("Couldn't create a record");
    }
  }

  async function onEditSubmit(event: FormEvent) {
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const editPromise = editRecord(formData);
      toast.promise(editPromise, {
        loading: 'Loading...',
        success: 'Record edited!',
      });
      const editedRecord = await editPromise;

      setRecords((prev) => {
        const updatedRecords = prev.map<Record>((record) =>
          record.id === editedRecord.id ? editedRecord : record
        );
        return [...updatedRecords];
      });
    } catch (error) {
      console.log(error);
      toast.error('Failed to edit a record');
    }
  }
  return (
    <>
      <Toaster />
      <RecordDialog id="create-dialog" buttonLabel="Create a Record" onSubmit={onCreateSubmit} />
      <Records
        records={records}
        activeRecordIds={activeRecordIds}
        setActiveRecordIds={setActiveRecordIds}
        tags={tags}
        setEditingRecord={setEditingRecord}
        reloadData={() => setChange((prev) => !prev)}
      />
      {editingRecord && (
        <RecordDialog
          id="edit-dialog"
          onSubmit={onEditSubmit}
          editingRecord={editingRecord}
          emptyEditingRecord={() => setEditingRecord(null)}
        />
      )}

      <hr />

      <ToggleSwitch
        switchLabel="Mode"
        labelOn="Live"
        labelOff="Static"
        checked={liveMode}
        onChange={handleLiveModeChange}
      />

      <ToggleSwitch
        switchLabel="View"
        labelOn="Domain"
        labelOff="Web"
        checked={domainView}
        onChange={handleViewChange}
      />

      <div id="graph">
        <Graph
          nodes={processedNodes}
          links={processedLinks}
          reloadData={() => setChange((prev) => !prev)}
        />
      </div>
      <hr />
    </>
  );
}
