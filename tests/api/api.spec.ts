import { test, expect } from '@playwright/test';
import { getAuthToken } from '../../utils/apiClient';
import { ICreateTaxonRequest, ITaxonResponse, ICreateTaxonUnsuccessfullResponse, IUnauthorizedResponse, ITaxonTranslation } from '../../types/api';

test.describe('API demo tests (GET, POST, PUT) based on Sylius API', () => {

    const baseURL = process.env.SYLIUS_API_URL || 'https://v2.demo.sylius.com';
    let token = '';

    test.beforeAll(async ({ playwright }) => {
        const requestContext = await playwright.request.newContext({
            extraHTTPHeaders: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        token = await getAuthToken(requestContext);
        await requestContext.dispose();
    });

    test('POST: Create a new taxon with translations', async ({ request }) => {
        const uniqueId = `taxon-${Date.now()}`;

        const data: ICreateTaxonRequest = {
            code: uniqueId,
            parent: null,
            translations: {
                "en_US": {
                    name: 'Test taxon name',
                    slug: `slug-${uniqueId}`,
                    description: "blah blah blah..."
                }
            },
            enabled: true
        }

        const response = await request.post(`${baseURL}/api/v2/admin/taxons`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            data: data
        });

        expect(response.status()).toBe(201);

        const body = await response.json() as ITaxonResponse;

        expect.soft(body.images).toHaveLength(0);
        expect.soft(body.id).toEqual(expect.any(Number));
        expect.soft(body.code).toStrictEqual(uniqueId);
        expect.soft(body.parent).toBeNull();
        expect.soft(body.translations.en_US).toMatchObject({
            ...data.translations.en_US,
            id: expect.any(Number),
        })
        expect.soft(body.enabled).toBeTruthy();
    });


    test('POST: Creation of new taxon fails due to wrong input', async ({ request }) => {
        const uniqueId = `taxon-${Date.now()}`;

        const data: ICreateTaxonRequest = {
            code: uniqueId,
            parent: 'test',
            translations: {
                'en_US': {
                    name: 'Test taxon name',
                    slug: `slug-${uniqueId}`,
                    description: "blah blah blah..."
                }
            },
            enabled: true
        }

        const response = await request.post(`${baseURL}/api/v2/admin/taxons`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: data
        });

        expect(response.status()).toBe(400);

        const body = await response.json() as ICreateTaxonUnsuccessfullResponse;

        expect.soft(body.title).toStrictEqual('An error occurred');
        expect.soft(body.detail).toStrictEqual(`Invalid IRI \"${data.parent}\".`);
        expect.soft(body.status).toEqual(400);
        expect.soft(body.type).toEqual('/errors/400');
    });

    test('POST: Creation of new taxon fails without authorization', async ({ request }) => {
        const uniqueId = `taxon-${Date.now()}`;

        const data: ICreateTaxonRequest = {
            code: uniqueId,
            parent: 'test',
            translations: {
                'en_US': {
                    name: 'Test taxon name',
                    slug: `slug-${uniqueId}`,
                    description: "blah blah blah..."
                }
            },
            enabled: true
        }

        const response = await request.post(`${baseURL}/api/v2/admin/taxons`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: data
        });

        expect(response.status()).toBe(401);

        const body = await response.json() as IUnauthorizedResponse;

        expect.soft(body.message).toStrictEqual('JWT Token not found');
    });

    test('GET: Get taxons returns a list of taxons', async ({ request }) => {
        const response = await request.get(`${baseURL}/api/v2/admin/taxons`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });

        expect(response.status()).toBe(200);

        const body = await response.json() as ITaxonResponse[];

        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBeGreaterThan(0);

        const taxon = body[Math.floor(Math.random() * body.length)];

        const expectedTaxon: Partial<Record<keyof ITaxonResponse, any>> = {
            images: [],
            id: expect.any(Number),
            code: expect.any(String),
            parent: taxon.parent === null ? null : expect.any(String),
            children: expect.any(Array),
            position: expect.any(Number),
            translations: expect.any(Object),
            enabled: expect.any(Boolean)
        };

        const expectedTranslation: Partial<Record<keyof ITaxonTranslation, any>> = {
            name: expect.any(String),
            slug: expect.any(String)
        }

        expect.soft(taxon).toMatchObject(expectedTaxon);

        const randomTranslation = Object.values(taxon.translations)[0];
        expect.soft(randomTranslation).toMatchObject(expectedTranslation)
    });


    test('PUT: Update taxon enable value', async ({ request }) => {
        //get taxon
        const getTaxonResponse = await request.get(`${baseURL}/api/v2/admin/taxons`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });

        expect(getTaxonResponse.status()).toBe(200);

        const getTaxonBody = await getTaxonResponse.json() as ITaxonResponse[];
        const taxon = getTaxonBody[Math.floor(Math.random() * getTaxonBody.length)];

        //remove not required fields
        const { id, translations, images, ...rest } = taxon;

        const putResponse = await request.put(`${baseURL}/api/v2/admin/taxons/${taxon.code}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {
                ...rest,
                "enabled": false
            }
        });

        expect(putResponse.status()).toBe(200);

        const body = await putResponse.json() as ITaxonResponse;

        expect.soft(body.enabled).toBeFalsy();
    });

});